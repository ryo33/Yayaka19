defmodule Share.ServerTrust do
  use Share.Web, :model

  schema "server_trust" do
    belongs_to :user, Share.User
    belongs_to :server, Share.Server

    timestamps()
  end

  @fields [:user_id, :server_id]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @fields)
    |> validate_required(@fields)
  end

  def trusted_servers(user_id) do
    from s in Share.Server,
      join: t in Share.ServerTrust,
      on: t.server_id == s.id,
      where: t.user_id == ^user_id
  end
end
