defmodule Share.OnlinePostHandler do
  alias Share.Repo
  alias Share.User
  alias Share.Follow
  import Ecto.Query

  def handle(post, user) do
    spawn(fn ->
      query = from f in Follow,
        join: user in User,
        on: user.id == f.user_id,
        where: f.target_user_id == ^user.id,
        select: user.name
      Repo.all(query)
      |> Enum.map(fn name ->
        spawn(fn ->
          topic = "user:" <> name
          Share.Endpoint.broadcast! topic, "add_online_posts", %{posts: [post]}
        end)
      end)
    end)
    spawn(fn ->
      topic = "user:" <> user.name
      Share.Endpoint.broadcast! topic, "add_online_posts", %{posts: [post]}
    end)
  end
end
