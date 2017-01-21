defmodule Share.UserChannel do
  use Share.Web, :channel
  alias Share.Follow
  alias Share.User
  alias Share.Post
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

  def handle_in("new_post", params, socket) do
    user = socket.assigns.user
    true = user != nil

    params = Map.put(params, "user_id", user.id)
    changeset = Post.changeset(%Post{}, params)
    Repo.insert!(changeset)
    {:reply, :ok, socket}
  end

  def handle_in("random_post", _params, socket) do
    query = from p in Post, order_by: fragment("RANDOM()"), limit: 1
    post = case Repo.one(query) do
      nil -> %{}
      post ->
        post = Repo.preload(post, [:user])
        %{
          text: post.text,
          user: post.user
        }
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
          user: user,
          "postCount": post_count,
          "following": follow_count,
          "followers": followed_count
        }
        {:reply, {:ok, res}, socket}
    end
  end
end
