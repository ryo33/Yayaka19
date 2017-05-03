defmodule Share.Server do
  use Share.Web, :model
  @derive {Poison.Encoder, only: [
    :id, :host
  ]}

  schema "servers" do
    field :host, :string

    timestamps()
  end

  @fields [:host]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @fields)
    |> validate_required(@fields)
  end

  def following(user) do
    from s in Share.Server,
      join: f in Share.ServerFollow,
      on: f.server_id == s.id,
      where: f.user_id == ^user.id
  end

  def from_host(host) do
    query = from s in Share.Server, where: s.host == ^host
    case Share.Repo.one(query) do
      nil ->
        params = %{host: host}
        changeset = Share.Server.changeset(%Share.Server{}, params)
        Share.Repo.insert!(changeset)
      server -> server
    end
  end
end
