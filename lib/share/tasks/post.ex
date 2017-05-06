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
    broadcast_to_user(post, post.user)
    broadcast_to_followers(post, post.user)
    {:broadcast_to_remote, [post]}
    |> Honeydew.async(:post)
    Share.Handlers.Notice.post(post)
  end

  def broadcast_to_user(post, user) do
    {:do_broadcast_to_user, [post, user]}
    |> Honeydew.async(:post)
  end

  def broadcast_to_followers(post, user) do
    {:do_broadcast_to_followers, [post, user]}
    |> Honeydew.async(:post)
  end

  def do_broadcast_to_followers(post, user) do
    query = from f in Follow,
    join: user in User,
    on: user.id == f.user_id,
    where: f.target_user_id == ^user.id,
    select: user
    Repo.all(query)
    |> Enum.map(fn user ->
      broadcast_to_user(post, user)
    end)
  end

  def do_broadcast_to_user(post, user) do
    topic = "user:" <> user.name
    Share.Endpoint.broadcast! topic, "add_new_posts", %{posts: [post]}
  end

  def broadcast_to_remote(post) do
    post = Share.Post.put_path(post)
    Share.Follow.remote_followers(post.user.id)
    |> Repo.all()
    |> Enum.each(fn follow ->
      host = follow.user.server.host
      Share.Remote.Message.create(host, "add_new_posts", %{posts: [post]})
      |> Share.Remote.RequestServer.request(noreply: true)
    end)
  end
end
