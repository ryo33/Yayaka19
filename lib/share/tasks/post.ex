defmodule Share.Tasks.Post do
  alias Share.Repo
  alias Share.Post
  alias Share.Follow

  def post(post) do
    post = post |> Post.preload()
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
    Follow.local_followers(user.id)
    |> Repo.all()
    |> Enum.map(fn follow ->
      broadcast_to_user(post, follow.user)
    end)
  end

  def do_broadcast_to_user(post, user) do
    topic = "user:" <> user.name
    Share.Endpoint.broadcast! topic, "add_new_posts", %{posts: [post]}
  end

  def broadcast_to_remote(post) do
    post = Share.Post.put_path(post)
    Share.Follow.followers_hosts(post.user.id)
    |> Repo.all()
    |> Enum.each(fn host ->
      Share.Remote.Message.create(host, "add_new_posts", %{posts: [post]})
      |> Share.Remote.RequestServer.request(noreply: true)
    end)
  end
end
