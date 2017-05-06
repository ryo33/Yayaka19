defmodule Share.Post do
  use Share.Web, :model

  defimpl Poison.Encoder, for: Share.Post do
    def encode(params, options) do
      Share.Post.to_map(params)
      |> Poison.encode!(options)
    end
  end

  schema "posts" do
    field :text, :string
    field :user_display, :string
    field :remote_id, :string
    field :remote_path, :string
    belongs_to :user, Share.User
    belongs_to :post, Share.Post
    belongs_to :mystery, Share.Mystery
    belongs_to :server, Share.Server

    has_many :post_addresses, Share.PostAddress

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
            :id, :text, :user_display, :user, :inserted_at,
            :post, :post_id, :post_addresses, :mystery, :mystery_id
          ])
    if not is_nil(params.server_id) do
      map
      |> Map.put(:host, params.server.host)
      |> Map.put(:path, params.remote_path)
    else
      map
    end
  end

  def put_path(%__MODULE__{} = post), do: put_path(to_map(post))
  def put_path(post) do
    path = Share.Router.Helpers.page_path(Share.Endpoint, :post, post.id)
    Map.put(post, :path, path)
    |> Map.update(:post, nil, fn post ->
      if is_nil(post), do: nil, else: put_path(post)
    end)
    |> Map.update(:mystery, nil, fn mystery ->
      if is_nil(mystery), do: nil, else: Share.Mystery.put_path(mystery)
    end)
    |> Map.update(:user, nil, fn user -> Share.User.put_path(user) end)
    |> Map.update(:post_addresses, nil, fn addresses ->
      Enum.map(addresses, fn address ->
        Share.PostAddress.put_path(address)
      end)
    end)
  end

  @required_fields ~w(user_id)a
  @optional_fields ~w(text post_id user_display mystery_id)a
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

  def public_timeline do
    Share.Post
    |> order_by([p], [desc: p.id])
    |> limit(50)
    |> Share.Post.preload()
  end

  def timeline(users) do
    Share.Post
    |> where([p], p.user_id in ^users)
    |> order_by([p], [desc: p.id])
    |> Share.Post.preload()
  end

  @preload [
    :user, :server, mystery: [:user], post_addresses: :user, post: [
      :user, mystery: [:user], post_addresses: :user]]
  @deep_preload [
    :user, :server, mystery: [:user], post_addresses: :user, post: [
      :user, :server, mystery: [:user], post_addresses: :user, post: [
        :user, :server, mystery: [:user], post_addresses: :user, post: [
          :user, :server, mystery: [:user], post_addresses: :user, post: [
            :user, :server, :post, mystery: [:user], post_addresses: :user]]]]]

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
end
