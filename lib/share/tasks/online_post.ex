defmodule Share.Tasks.OnlinePost do
  alias Share.Repo
  alias Share.User
  alias Share.Follow
  import Ecto.Query

  def broadcast_to_followers(post, user) do
    query = from f in Follow,
      join: user in User,
      on: user.id == f.user_id,
      where: f.target_user_id == ^user.id,
      select: user
    Repo.all(query)
    |> Enum.map(fn user ->
      {:broadcast_to_user, [post, user]}
      |> Honeydew.async(:online_post)
    end)
  end

  def broadcast_to_user(post, user) do
    topic = "user:" <> user.name
    Share.Endpoint.broadcast! topic, "add_online_posts", %{posts: [post]}
  end
end
