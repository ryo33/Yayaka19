defmodule Share.Follow do
  use Share.Web, :model
  @derive {Poison.Encoder, only: [
    :id, :user, :target_user, :inserted_at
  ]}

  schema "follows" do
    belongs_to :user, Share.User
    belongs_to :target_user, Share.User

    timestamps()
  end

  @fields [:user_id, :target_user_id]
  @preload_params [:user, :target_user]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @fields)
    |> validate_required(@fields)
  end

  def preload(%Share.Follow{} = follow) do
    Share.Repo.preload(follow, @preload_params)
  end

  def preload(query) do
    Ecto.Query.preload(query, ^@preload_params)
  end

  def get_followers(user) do
    from f in Share.Follow,
      join: u in Share.User, on: u.id == f.target_user_id,
      where: u.id == ^user.id,
      order_by: [desc: f.id],
      preload: ^@preload_params
  end

  def get_following(user) do
    from f in Share.Follow,
      join: u in Share.User, on: u.id == f.user_id,
      where: u.id == ^user.id,
      order_by: [desc: f.id],
      preload: ^@preload_params
  end
end
