defmodule Share.Mystery do
  use Share.Web, :model
  @map_keys [
    :id, :user, :title, :inserted_at # ! :text
  ]
  defimpl Poison.Encoder, for: Share.Mystery do
    def encode(params, options) do
      params
      |> Share.Mystery.to_map()
      |> Poison.encode!(options)
    end
  end

  schema "mysteries" do
    field :title, :string
    field :text, :string
    field :remote_id, :string
    field :remote_path, :string
    belongs_to :user, Share.User
    belongs_to :server, Share.Server

    timestamps()
  end

  def to_map(params) do
    map = Map.from_struct(params)
          |> Map.take(@map_keys)
    if not is_nil(params.server_id) do
      params = Share.Repo.preload(params, [:server])
      map
      |> Map.put(:host, params.server.host)
      |> Map.put(:path, params.remote_path)
      |> Map.put(:id, params.remote_id)
    else
      map
    end
  end

  def put_path(%__MODULE__{} = mystery), do: put_path(to_map(mystery))
  def put_path(mystery) do
    path = Share.Router.Helpers.page_path(Share.Endpoint, :mystery, mystery.id)
    Map.put(mystery, :path, path)
    |> Map.update!(:user, fn user -> Share.User.put_path(user) end)
  end

  def put_host(mystery, host) do
    mystery
    |> Map.update("user", nil, fn user ->
      if is_nil(user), do: nil, else: Share.User.put_host(user, host)
    end)
    |> Map.put_new("host", host)
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :text, :user_id])
    |> validate_required([:title, :text, :user_id])
    |> validate_length(:title, min: 1, max: 128)
    |> validate_length(:text, min: 1, max: 4096)
  end

  def remote_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :text, :user_id, :server_id, :remote_path, :remote_id, :inserted_at])
    |> validate_required([:title])
    |> validate_length(:title, min: 1, max: 128)
  end

  def user_mysteries(user) do
    from m in Share.Mystery,
      where: m.user_id == ^user.id
  end

  @preload [:user, :server]

  def preload(%Share.Mystery{} = mystery) do
    Share.Repo.preload(mystery, @preload)
  end

  def preload(query) do
    query
    |> preload(^@preload)
  end

  def from_map(mystery) do
    mystery_host = Map.get(mystery, "host")
    user = cond do
      is_nil(mystery_host) ->
        id = Map.get(mystery, "remote_id", Map.get(mystery, "id"))
        Share.Repo.get!(Share.Mystery, id)
      mystery_host == Share.Remote.host ->
        id = Map.get(mystery, "remote_id")
        Share.Repo.get!(Share.Mystery, id)
      true ->
        server = Share.Server.from_host(mystery_host)
        from_remote_mystery(server, mystery)
    end
  end

  def from_remote_mystery(server, mystery) do
    mystery_id = Map.get(mystery, "id")
    remote_id = Map.get(mystery, "remote_id") || to_string(mystery_id)
    query = from u in Share.Mystery,
      where: u.server_id == ^server.id,
      where: u.remote_id == ^remote_id
    case Share.Repo.one(query) do
      nil ->
        user = Share.User.from_map(Map.get(mystery, "user"))
        params = %{
          user_id: user.id,
          title: Map.get(mystery, "title"),
          server_id: server.id,
          remote_id: remote_id,
          remote_path: Map.get(mystery, "path"),
          inserted_at: Map.get(mystery, "inserted_at")
        }
        changeset = Share.Mystery.remote_changeset(%__MODULE__{}, params)
        Share.Repo.insert!(changeset)
      mystery -> mystery
    end
    |> preload()
  end

  def local_mystery_by_id(id) do
    from m in Share.Mystery,
      where: m.id == ^id,
      where: is_nil(m.server_id),
      where: is_nil(m.remote_id),
      where: is_nil(m.remote_path)
  end
end
