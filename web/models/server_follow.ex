defmodule Share.ServerFollow do
  use Share.Web, :model

  schema "server_follow" do
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

  def following_servers(user) do
    from s in Share.Server,
      join: f in Share.ServerFollow,
      on: f.server_id == s.id,
      where: f.user_id == ^user.id
  end
end
