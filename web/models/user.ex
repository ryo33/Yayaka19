defimpl Poison.Encoder, for: Ecto.Association.NotLoaded do
  def encode(_struct, _options) do
    "null"
  end
end

defmodule Share.User do
  use Share.Web, :model
  defimpl Poison.Encoder, for: Share.User do
    def encode(params, options) do
      params
      |> Share.Repo.preload([:server])
      |> Share.User.to_map()
      |> Poison.encode!(options)
    end
  end

  schema "users" do
    field :provider, :string
    field :provided_id, :string
    field :num, :integer
    field :name, :string
    field :display, :string
    field :bio, :string
    field :noticed, :naive_datetime
    field :secret, :string
    field :password, :string
    field :remote_path, :string
    belongs_to :server, Share.Server

    timestamps()
  end

  @map_keys [
    :name, :display, :bio, :id
  ]
  def to_map(params) do
    map = Map.from_struct(params)
          |> Map.take(@map_keys)
    if not is_nil(params.server_id) do
      map
      |> Map.put(:host, params.server.host)
      |> Map.put(:path, params.remote_path)
    else
      map
    end
  end

  def put_path(%__MODULE__{} = user) do
    user = user |> Share.Repo.preload([:server])
    put_path(to_map(user))
  end
  def put_path(user) do
    path = Share.Router.Helpers.page_path(Share.Endpoint, :user, user.name)
    Map.put_new(user, :path, path)
  end

  def put_host(user, host) do
    user
    |> Map.put_new("host", host)
  end

  @required_fields [:name, :display]
  @fields [:bio] ++ @required_fields

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @fields)
    |> validate_required(@required_fields)
    |> validate_length(:name, min: 1, max: 32)
    |> validate_length(:display, min: 1, max: 32)
    |> validate_length(:bio, min: 0, max: 2048)
    |> unique_constraint(:name)
  end

  def password_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:password])
    |> validate_required([:password])
    |> validate_length(:password, min: 6, max: 255)
    |> update_change(:password, fn p -> Comeonin.Bcrypt.hashpwsalt(p) end)
  end

  def remote_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :display, :bio, :server_id, :remote_path])
    |> validate_required([:name, :display, :server_id, :remote_path])
  end

  def from_map(user) do
    user_host = Map.get(user, "host")
    user_name = Map.get(user, "name")
    user = if is_nil(user_host) or user_host == Share.Remote.host do
      Share.Repo.one!(Share.User.local_user_by_name(user_name))
    else
      server = Share.Server.from_host(user_host)
      from_remote_user(server, user)
    end
  end

  def from_remote_user(server, user) do
    user_name = Map.get(user, "name")
    query = from u in Share.User,
      where: u.server_id == ^server.id,
      where: u.name == ^user_name
    case Share.Repo.one(query) do
      nil ->
        params = %{
          name: user_name,
          display: Map.get(user, "display"),
          bio: Map.get(user, "bio"),
          server_id: server.id,
          remote_path: Map.get(user, "path")
        }
        changeset = Share.User.remote_changeset(%__MODULE__{}, params)
        Share.Repo.insert!(changeset)
      user -> user
    end
  end

  def local_user_by_name(name) do
    from u in Share.User,
      where: u.name == ^name,
      where: is_nil(u.server_id),
      where: is_nil(u.remote_path)
  end

  def remote_user_by_name(host, name) do
    from u in Share.User,
      join: s in Share.Server,
      on: u.server_id == s.id,
      where: u.name == ^name,
      where: s.host == ^host
  end
end
