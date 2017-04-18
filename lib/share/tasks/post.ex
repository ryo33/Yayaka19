defmodule Share.Tasks.Post do
  alias Share.Repo
  alias Share.User
  alias Share.Post
  alias Share.PostAddress
  alias Share.Follow
  import Ecto.Query

  defp get_post(post) do
    Repo.one!(from p in Post, where: p.id == ^post.id, preload: ^Post.preload_params)
  end

  def post(post, address) do
    post = if String.length(address) >= 1 do
      case Repo.get_by(User, name: address) do
        user when not is_nil(user) ->
          params = %{user_id: user.id, post_id: post.id}
          changeset = PostAddress.changeset(%PostAddress{}, params)
          Repo.insert!(changeset)
          get_post(post)
      end
    else
      post |> Post.preload()
    end
    {:broadcast_to_user, [post, post.user]}
    |> Honeydew.async(:post)
    {:broadcast_to_followers, [post]}
    |> Honeydew.async(:post)
    Share.Handlers.Notice.post(post)
  end

  def broadcast_to_followers(post) do
    query = from f in Follow,
    join: user in User,
    on: user.id == f.user_id,
    where: f.target_user_id == ^post.user.id,
    select: user
    Repo.all(query)
    |> Enum.map(fn user ->
      {:broadcast_to_user, [post, user]}
      |> Honeydew.async(:post)
    end)
  end

  def broadcast_to_user(post, user) do
      topic = "user:" <> user.name
      Share.Endpoint.broadcast! topic, "add_new_posts", %{posts: [post]}
  end
end
