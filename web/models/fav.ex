defmodule Share.Fav do
  use Share.Web, :model

  schema "favs" do
    belongs_to :user, Share.User
    belongs_to :post, Share.Post

    timestamps()
  end

  @fields [:user_id, :post_id]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @fields)
    |> validate_required(@fields)
  end

  def get_favs(socket, posts) do
    user = socket.assigns.user
    if is_nil(user) do
      []
    else
      query = from p in Share.Post,
        left_join: f in Share.Fav, on: f.post_id == p.id and f.user_id == ^user.id,
        where: not is_nil(f.id),
        where: p.id in ^posts,
        select: p.id
      Share.Repo.all(query)
      |> Enum.map(fn id -> socket.assigns.posts[id] end)
    end
  end
end
