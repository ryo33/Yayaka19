defmodule Share.PageChannel do
  use Share.Web, :channel
  alias Share.Follow
  alias Share.User
  alias Share.Post
  alias Share.Fav
  alias Share.Follow
  alias Share.Mystery
  alias Share.Repo

  require Logger

  @user_posts_limit 10

  def join("page", _params, socket) do
    {:ok, socket}
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
        query = from p in Post,
          where: p.user_id == ^user.id,
          order_by: [desc: :id],
          limit: @user_posts_limit
        posts = Repo.all(Post.preload(query))
        ids = Enum.map(posts, &(&1.id))
        favs = Fav.get_favs(socket, ids)
        mysteries_count = Repo.aggregate(Mystery.user_mysteries(user), :count, :id)
        opened_mysteries_count = Repo.aggregate(Post.opened_mystery_posts(user), :count, :id)
        res = %{
          "user" => user,
          "posts" => posts,
          "favs" => favs,
          "postCount" => post_count,
          "following" => follow_count,
          "followers" => followed_count,
          "mysteries" => mysteries_count,
          "openedMysteries" => opened_mysteries_count
        }
        {:reply, {:ok, res}, socket}
    end
  end

  def handle_in("more_user_posts", %{"user" => name, "id" => less_than_id}, socket) do
    case Repo.get_by(User, name: name) do
      nil -> {:reply, :error, socket}
      user ->
        query = from p in Post,
          where: p.user_id == ^user.id,
          where: p.id < ^less_than_id,
          order_by: [desc: :id],
          limit: @user_posts_limit
        posts = Repo.all(Post.preload(query))
        ids = Enum.map(posts, &(&1.id))
        favs = Fav.get_favs(socket, ids)
        res = %{
          "posts" => posts,
          "favs" => favs,
        }
        {:reply, {:ok, res}, socket}
    end
  end

  def handle_in("post", %{"id" => id}, socket) do
    case Repo.get(Post, id) do
      nil -> {:reply, :error, socket}
      post ->
        res = %{
          post: Post.deep_preload(post),
          favs: Fav.get_favs(socket, [post.id])
        }
        {:reply, {:ok, res}, socket}
    end
  end

  def handle_in("post_contexts", %{"id" => id}, socket) do
    case Repo.get(Post, id) do
      nil -> {:reply, :error, socket}
      post ->
        timeline = Share.UserChannel.get_timeline(post.user_id, socket, [limit: 10, less_than_id: post.id])
        {:reply, {:ok, timeline}, socket}
    end
  end

  def handle_in("public_timeline", _params, socket) do
    query = Post
            |> order_by([p], [desc: p.id])
            |> limit(50)
            |> Post.preload()
    posts = Repo.all(query)
    post_ids = posts |> Enum.map(&(&1.id))
    favs = Fav.get_favs(socket, post_ids)
    {:reply, {:ok, %{posts: posts, favs: favs}}, socket}
  end

  def handle_in("followers", %{"name" => name}, socket) do
    case Repo.get_by(User, name: name) do
      nil -> {:reply, :error, socket}
      user ->
        followers = Repo.all(Follow.get_followers(user))
        {:reply, {:ok, %{user: user, followers: followers}}, socket}
    end
  end

  def handle_in("following", %{"name" => name}, socket) do
    case Repo.get_by(User, name: name) do
      nil -> {:reply, :error, socket}
      user ->
        following = Repo.all(Follow.get_following(user))
        {:reply, {:ok, %{user: user, following: following}}, socket}
    end
  end

  def handle_in("user_mysteries", %{"name" => name}, socket) do
    case Repo.get_by(User, name: name) do
      nil -> {:reply, :error, socket}
      user ->
        query = Mystery.user_mysteries(user)
                |> Post.from_mysteries(user)
        mysteries = Repo.all(query)
        {:reply, {:ok, %{user: user, mysteries: mysteries}}, socket}
    end
  end

  def handle_in("opened_mysteries", %{"name" => name}, socket) do
    case Repo.get_by(User, name: name) do
      nil -> {:reply, :error, socket}
      user ->
        query = Post.opened_mystery_posts(user)
                |> Post.preload()
        mysteries = Repo.all(query)
        {:reply, {:ok, %{user: user, mysteries: mysteries}}, socket}
    end
  end

  def handle_in("ping", _params, socket) do
    {:reply, :ok, socket}
  end
end
