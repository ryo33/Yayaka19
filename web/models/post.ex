defmodule Share.Post do
  use Share.Web, :model

  defimpl Poison.Encoder, for: Share.Post do
    def encode(params, options) do
      params
      |> Share.Post.to_map()
      |> Poison.encode!(options)
    end
  end

  schema "posts" do
    field :text, :string
    field :user_display, :string
    field :remote_id, :string
    field :remote_path, :string
    belongs_to :address_user, Share.User
    belongs_to :user, Share.User
    belongs_to :post, Share.Post
    belongs_to :mystery, Share.Mystery
    belongs_to :server, Share.Server

    timestamps()
  end

  def to_map(params) do
    params = case params.post do
      %Ecto.Association.NotLoaded{} -> Map.delete(params, :post)
      _ -> params
    end
    params = case params.mystery do
      %Ecto.Association.NotLoaded{} -> Map.delete(params, :mystery)
      _ -> params
    end
    map = Map.from_struct(params)
          |> Map.take([
            :id, :text, :user_display, :user, :address_user, :inserted_at,
            :post, :post_id, :mystery, :mystery_id, :remote_id
          ])
    if not is_nil(params.server_id) do
      params = Share.Repo.preload(params, [:server])
      map
      |> Map.put(:host, params.server.host)
      |> Map.put(:path, params.remote_path)
    else
      map
    end
  end

  def put_path(%__MODULE__{} = post) do
    post = Share.Repo.preload(post, Share.Post.preload_params)
    put_path(to_map(post))
  end
  def put_path(post) do
    path = Share.Router.Helpers.page_path(Share.Endpoint, :post, post.id)
    Map.put(post, :path, path)
    |> Map.update!(:user, fn user -> Share.User.put_path(user) end)
    |> Map.update(:post, nil, fn post ->
      if is_nil(post), do: nil, else: put_path(post)
    end)
    |> Map.update(:mystery, nil, fn mystery ->
      if is_nil(mystery), do: nil, else: Share.Mystery.put_path(mystery)
    end)
    |> Map.update(:address_user, nil, fn user ->
      if is_nil(user), do: nil, else: Share.User.put_path(user)
    end)
  end

  def put_host(post, host) do
    post
    |> Map.update("user", nil, fn user ->
      if is_nil(user), do: nil, else: Share.User.put_host(user, host)
    end)
    |> Map.update("address_user", nil, fn user ->
      if is_nil(user), do: nil, else: Share.User.put_host(user, host)
    end)
    |> Map.update("post", nil, fn post ->
      if is_nil(post), do: nil, else: put_host(post, host)
    end)
    |> Map.update("mystery", nil, fn mystery ->
      if is_nil(mystery), do: nil, else: Share.Mystery.put_host(mystery, host)
    end)
    |> Map.put_new("host", host)
  end

  @required_fields ~w(user_id)a
  @optional_fields ~w(text post_id user_display mystery_id address_user_id
                      server_id remote_id remote_path inserted_at)a
  @fields @required_fields ++ @optional_fields

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @fields)
    |> validate_required(@required_fields)
    |> validate_length(:text, min: 0)
  end

  def opened_mystery_posts(user) do
    from p in Share.Post,
      join: m in Share.Mystery, on: p.mystery_id == m.id,
      where: p.user_id == ^user.id and m.user_id != ^user.id,
      order_by: [desc: :id]
  end

  def from_mysteries(query, user) do
    from p in Share.Post,
      right_join: m in ^query, on: p.mystery_id == m.id,
      where: p.user_id == ^user.id,
      preload: ^Share.Post.preload_params,
      order_by: [desc: :id]
  end

  def public_timeline(posts_limit \\ 50) do
    Share.Post
    |> order_by([p], [desc: p.id])
    |> limit(^posts_limit)
    |> Share.Post.preload()
  end

  def timeline(users) do
    Share.Post
    |> where([p], p.user_id in ^users)
    |> order_by([p], [desc: p.id])
    |> Share.Post.preload()
  end

  @preload [
    :user, :server, :address_user, mystery: [:user], post: [
      :user, :server, :address_user, mystery: [:user]]]
  @deep_preload [
    :user, :server, :address_user, mystery: [:user], post: [
      :user, :server, :address_user, mystery: [:user], post: [
        :user, :server, :address_user, mystery: [:user], post: [
          :user, :server, :address_user, mystery: [:user], post: [
            :user, :server, :post, :address_user, mystery: [:user]]]]]]

  def preload_params, do: @preload
  def deep_preload_params, do: @deep_preload

  def preload(%Share.Post{} = post) do
    Share.Repo.preload(post, @preload)
  end

  def preload(query) do
    query
    |> preload(^@preload)
  end

  def deep_preload(%Share.Post{} = post) do
    Share.Repo.preload(post, @deep_preload)
  end

  def deep_preload(query) do
    query
    |> preload(^@deep_preload)
  end

  def from_map(post) do
    post_host = Map.get(post, "host")
    user = cond do
      is_nil(post_host) ->
        id = Map.get(post, "remote_id", Map.get(post, "id"))
        Share.Repo.get!(Share.Post, id)
      post_host == Share.Remote.host ->
        id = Map.get(post, "remote_id")
        Share.Repo.get!(Share.Post, id)
      true ->
        server = Share.Server.from_host(post_host)
        from_remote_post(server, post)
    end
  end

  def from_remote_post(server, post) do
    post_id = Map.get(post, "id")
    remote_id = Map.get(post, "remote_id") || to_string(post_id)
    query = from u in Share.Post,
      where: u.server_id == ^server.id,
      where: u.remote_id == ^remote_id
    case Share.Repo.one(query) do
      nil ->
        user = Share.User.from_map(Map.get(post, "user"))
        mystery_id = case Map.get(post, "mystery") do
          mystery when not is_nil(mystery) ->
            mystery = Share.Mystery.from_map(mystery)
            mystery.id
          nil -> nil
        end
        params = %{
          user_id: user.id,
          text: Map.get(post, "text"),
          user_display: Map.get(post, "user_display"),
          server_id: server.id,
          remote_id: remote_id,
          mystery_id: mystery_id,
          remote_path: Map.get(post, "path"),
          inserted_at: Map.get(post, "inserted_at")
        }
        address_user = Map.get(post, "address_user")
        params = if not is_nil(address_user) do
          user = Share.User.from_map(address_user)
          Map.put(params, :address_user_id, user.id)
        else
          params
        end
        child_post = Map.get(post, "post")
        params = if not is_nil(child_post) do
          child_post = Share.Post.from_map(child_post)
          Map.put(params, :post_id, child_post.id)
        else
          params
        end
        changeset = Share.Post.changeset(%__MODULE__{}, params)
        Share.Repo.insert!(changeset)
      post -> post
    end
    |> preload()
  end
end
