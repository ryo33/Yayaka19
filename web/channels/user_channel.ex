defmodule Share.UserChannel do
  use Share.Web, :channel
  alias Share.Follow
  alias Share.User
  alias Share.Post
  alias Share.Fav
  alias Share.Repo

  require Logger

  def join("user", _params, socket) do
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

  def handle_in("new_post", %{"post" => params, "address" => address}, socket) do
    user = socket.assigns.user
    true = user != nil
    params = Map.put(params, "user_id", user.id)
    changeset = Post.changeset(%Post{}, params)
    post = Repo.insert!(changeset)
    Share.PostHandler.handle_address(post, address, socket)
    {:reply, :ok, socket}
  end

  def handle_in("random_post", _params, socket) do
    user = socket.assigns.user
    query = Post
            |> limit(1)
            |> Post.random()
            |> Post.preload()
    post = case Repo.one(query) do
      nil -> %{}
      post ->
        changeset = Ecto.Changeset.change(post, %{views: post.views + 1})
        Repo.update(changeset)
        post
    end
    res = %{
      post: post,
      favs: Fav.get_favs(socket, [post.id])
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

  def handle_in("follow", %{"id" => id}, socket) do
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

  def handle_in("unfollow", %{"id" => id}, socket) do
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
    user = socket.assigns.user
    query = Post
            |> limit(50)
            |> Post.random()
    query = subquery(query)
            |> order_by([p], [desc: p.id])
            |> Post.preload()
    posts = Repo.all(query)
    post_ids = posts |> Enum.map(&(&1.id))
    Repo.update_all((from p in Post, where: p.id in ^post_ids), inc: [views: 1])
    favs = Fav.get_favs(socket, post_ids)
    {:reply, {:ok, %{posts: posts, favs: favs}}, socket}
  end

  def handle_in("timeline", _params, socket) do
    user = socket.assigns.user
    query = from f in Follow,
      select: f.target_user_id,
      where: f.user_id == ^user.id
    users = [user.id | Repo.all(query)]
    query = Post
            |> where([p], p.user_id in ^users)
            |> limit(50)
            |> Post.random()
    query = subquery(query)
            |> order_by([p], [desc: p.id])
            |> Post.preload()
    posts = Repo.all(query)
    post_ids = posts |> Enum.map(&(&1.id))
    favs = Fav.get_favs(socket, post_ids)
    {:reply, {:ok, %{posts: posts, favs: favs}}, socket}
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

  def handle_in("fav", %{"id" => id}, socket) do
    user = socket.assigns.user
    query = from f in Fav,
      where: f.user_id == ^user.id,
      where: f.post_id == ^id
    with 0 <- Repo.aggregate(query, :count, :id),
         params <- %{user_id: user.id, post_id: id},
         changeset <- Fav.changeset(%Fav{}, params),
         {:ok, _changeset} <- Repo.insert(changeset) do
      {:reply, :ok, socket}
    else
      _ -> {:reply, :error, socket}
    end
  end

  def handle_in("unfav", %{"id" => id}, socket) do
    user = socket.assigns.user
    query = from f in Fav,
      where: f.user_id == ^user.id,
      where: f.post_id == ^id
    case Repo.one(query) do
      nil -> {:reply, :error, socket}
      fav -> case Repo.delete(fav) do
        {:ok, _} -> {:reply, :ok, socket}
        _ -> {:reply, :error, socket}
      end
    end
  end
end
