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

  def get_followers(user_id) do
    from f in Share.Follow,
      where: f.target_user_id == ^user_id,
      order_by: [desc: f.id],
      preload: ^@preload_params
  end

  def get_following_ids(user_id) do
    from f in Share.Follow,
      where: f.user_id == ^user_id,
      select: f.target_user_id
  end

  def get_following(user_id) do
    from f in Share.Follow,
      where: f.user_id == ^user_id,
      order_by: [desc: f.id],
      preload: ^@preload_params
  end

  def get_follow(user_id, target_id) do
    from f in Share.Follow,
      where: f.user_id == ^user_id,
      where: f.target_user_id == ^target_id
  end

  def remote_followers(user_id) do
    from f in Share.Follow,
      join: u in Share.User, on: f.user_id == u.id,
      where: f.target_user_id == ^user_id,
      where: not is_nil(u.server_id),
      preload: [user: [:server]]
  end

  def remote_following(user_id) do
    from f in Share.Follow,
      join: u in Share.User, on: f.target_user_id == u.id,
      where: f.user_id == ^user_id,
      where: not is_nil(u.server_id),
      preload: [target_user: [:server]]
  end
end
