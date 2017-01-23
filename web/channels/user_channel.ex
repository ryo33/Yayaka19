defmodule Share.UserChannel do
  use Share.Web, :channel
  alias Share.Follow
  alias Share.User
  alias Share.Post
  alias Share.Repo

  require Logger

  def join("user", _params, socket) do
    socket = assign(socket, :posts, %{})
    user = socket.assigns.user
    following = if user != nil do
      query = from f in Follow,
        select: f.target_user_id,
        where: f.user_id == ^user.id
      Repo.all(query)
    else
      []
    end
    res = %{
      user: user,
      following: following
    }
    {:ok, res, socket}
  end

  def handle_in("new_post", params, socket) do
    user = socket.assigns.user
    true = user != nil

    params = Map.put(params, "user_id", user.id)
    changeset = Post.changeset(%Post{}, params)
    Repo.insert!(changeset)
    {:reply, :ok, socket}
  end

  def handle_in("random_post", _params, socket) do
    query = from p in Post,
      preload: [:user],
      limit: 1
    {post, socket} = case Repo.one(Post.random(query)) do
      nil -> {%{}, socket}
      post ->
        changeset = Ecto.Changeset.change(post, %{views: post.views + 1})
        Repo.update(changeset)
        Post.encode(post, socket)
    end
    res = %{
      post: post
    }
    {:reply, {:ok, res}, socket}
  end

  def handle_in("user_info", %{"name" => name}, socket) do
    case Repo.get_by(User, name: name) do
      nil -> {:reply, :error, socket}
      user ->
        query = from p in Post, where: p.user_id == ^user.id
        post_count = Repo.aggregate(query, :count, :id)
        query = from f in Follow, where: f.user_id == ^user.id
        follow_count = Repo.aggregate(query, :count, :id)
        query = from f in Follow, where: f.target_user_id == ^user.id
        followed_count = Repo.aggregate(query, :count, :id)
        res = %{
          "user" => user,
          "postCount" => post_count,
          "following" => follow_count,
          "followers" => followed_count
        }
        {:reply, {:ok, res}, socket}
    end
  end

  def handle_in("follow", id, socket) do
    user = socket.assigns.user
    query = from f in Follow,
      where: f.user_id == ^user.id,
      where: f.target_user_id == ^id
    with true <- user.id != id,
         0 <- Repo.aggregate(query, :count, :id),
         params <- %{user_id: user.id, target_user_id: id},
         changeset <- Follow.changeset(%Follow{}, params),
         {:ok, _changeset} <- Repo.insert(changeset) do
      {:reply, :ok, socket}
    else
      _ -> {:reply, :error, socket}
    end
  end

  def handle_in("unfollow", id, socket) do
    user = socket.assigns.user
    query = from f in Follow,
      where: f.user_id == ^user.id,
      where: f.target_user_id == ^id
    case Repo.one(query) do
      nil -> {:reply, :error, socket}
      follow -> case Repo.delete(follow) do
        {:ok, _} -> {:reply, :ok, socket}
        _ -> {:reply, :error, socket}
      end
    end
  end

  def handle_in("public_timeline", _params, socket) do
    random_query = from p in Post,
      limit: 50
    query = from p in subquery(Post.random(random_query)),
      order_by: [desc: p.id],
      preload: [:user]
    posts = Repo.all(query)
    post_ids = posts |> Enum.map(&(&1.id))
    Repo.update_all((from p in Post, where: p.id in ^post_ids), inc: [views: 1])
    {posts, socket} = Enum.map_reduce(posts, socket, &Post.encode(&1, &2))
    {:reply, {:ok, %{posts: posts}}, socket}
  end

  def handle_in("timeline", _params, socket) do
    user = socket.assigns.user
    query = from f in Follow,
      select: f.target_user_id,
      where: f.user_id == ^user.id
    users = Repo.all(query)
    random_query = from p in Post,
      where: p.user_id in ^users,
      limit: 50
    query = from p in subquery(Post.random(random_query)),
      order_by: [desc: p.id],
      preload: [:user]
    posts = Repo.all(query)
    {posts, socket} = Enum.map_reduce(posts, socket, &Post.encode(&1, &2))
    {:reply, {:ok, %{posts: posts}}, socket}
  end

  def handle_in("info", _params, socket) do
    post_count = Repo.aggregate(Post, :count, :id)
    user_count = Repo.aggregate(User, :count, :id)
    res = %{
      posts: post_count,
      users: user_count
    }
    {:reply, {:ok, res}, socket}
  end
end
