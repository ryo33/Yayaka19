defmodule Share.PageChannel do
  use Share.Web, :channel
  alias Share.UserActions
  alias Share.Follow
  alias Share.User
  alias Share.Post
  alias Share.Fav
  alias Share.Follow
  alias Share.Mystery
  alias Share.Server
  alias Share.Repo

  require Logger

  @user_posts_limit 10

  def join("page", _params, socket) do
    {:ok, socket}
  end

  def handle_in("user_info", %{"name" => name}, socket) do
    case Repo.one(User.local_user_by_name(name)) do
      nil -> {:reply, :error, socket}
      user ->
        res = UserActions.user_info(user, socket.assigns.user)
        {:reply, {:ok, res}, socket}
    end
  end

  def handle_in("remote_user_info", %{"host" => host, "name" => name}, socket) do
    Share.Remote.Message.create(host, "user_info", %{name: name})
    |> Share.Remote.RequestServer.request()
    |> case do
      {:ok, %{"payload" => %{"info" => info}}} ->
        info = info
               |> Map.update!("user", &Map.put(&1, "host", host))
               |> Map.update!("posts", fn posts ->
                 Enum.map(posts, &Map.put(&1, "host", host))
               end)
        {:reply, {:ok, info}, socket}
      _ ->
        {:reply, :error, socket}
    end
  end

  def handle_in("more_user_posts", %{"user" => name, "id" => less_than_id}, socket) do
    case Repo.one(User.local_user_by_name(name)) do
      nil -> {:reply, :error, socket}
      user ->
        query = from p in Post,
          where: p.user_id == ^user.id,
          where: p.id < ^less_than_id,
          order_by: [desc: :id],
          limit: @user_posts_limit
        posts = Repo.all(Post.preload(query))
        favs = Fav.get_favs(posts, socket.assigns.user)
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
          favs: Fav.get_favs([post], socket.assigns.user)
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

  @remote_timeout 4000
  def handle_in("public_timeline", _params, socket) do
    user = socket.assigns.user
    servers = if is_nil(user) do
      []
    else
      Share.ServerFollow.following_servers(user.id)
      |> Repo.all()
    end
    task = Task.async(fn ->
      posts = Post.public_timeline()
              |> Repo.all()
    end)
    response = Enum.map(servers, fn %{host: host} ->
      task = Task.async(fn ->
        resp = Share.Remote.Message.create(host, "public_timeline")
               |> Share.Remote.RequestServer.request()
        resp
      end)
      {task, host}
    end)
    |> Enum.map(fn {task, host} ->
      case Task.yield(task, @remote_timeout) || Task.shutdown(task) do
        {:ok, resp} ->
          case resp do
            {:ok, %{"payload" => %{"posts" => posts}}} ->
              posts = Task.async_stream(posts, fn post ->
                Map.put(post, "host", host)
              end)
              |> Enum.map(fn {:ok, post} -> post end)
              {:ok, host, posts}
            :timeout -> {:timeout, host}
            _ -> {:error, host}
          end
        {:exit, _} -> {:error, host}
        nil -> {:timeout, host}
      end
    end)
    posts = Task.await(task)
    favs = Fav.get_favs(posts, user)
    {hosts, posts} = Enum.reduce(response, {%{}, [posts]}, fn res, {hosts, list} ->
      case res do
        {:ok, host, posts} ->
          hosts = Map.put(hosts, host, "ok")
          list = [posts | list]
          {hosts, list}
        {:timeout, host} ->
          hosts = Map.put(hosts, host, "timeout")
          {hosts, list}
        {:error, host} ->
          hosts = Map.put(hosts, host, "error")
          {hosts, list}
        _ ->
          {hosts, list}
      end
    end)
    posts = List.flatten(posts)
    {:reply, {:ok, %{hosts: hosts, posts: posts, favs: favs}}, socket}
  end

  def handle_in("followers", %{"name" => name}, socket) do
    case Repo.one(User.local_user_by_name(name)) do
      nil -> {:reply, :error, socket}
      user ->
        followers = Repo.all(Follow.get_followers(user.id))
        {:reply, {:ok, %{user: user, followers: followers}}, socket}
    end
  end

  def handle_in("following", %{"name" => name}, socket) do
    case Repo.one(User.local_user_by_name(name)) do
      nil -> {:reply, :error, socket}
      user ->
        following = Repo.all(Follow.get_following(user.id))
        {:reply, {:ok, %{user: user, following: following}}, socket}
    end
  end

  def handle_in("user_mysteries", %{"name" => name}, socket) do
    case Repo.one(User.local_user_by_name(name)) do
      nil -> {:reply, :error, socket}
      user ->
        query = Mystery.user_mysteries(user)
                |> Post.from_mysteries(user)
        mysteries = Repo.all(query)
        {:reply, {:ok, %{user: user, mysteries: mysteries}}, socket}
    end
  end

  def handle_in("opened_mysteries", %{"name" => name}, socket) do
    case Repo.one(User.local_user_by_name(name)) do
      nil -> {:reply, :error, socket}
      user ->
        query = Post.opened_mystery_posts(user)
                |> Post.preload()
        mysteries = Repo.all(query)
        {:reply, {:ok, %{user: user, mysteries: mysteries}}, socket}
    end
  end

  def handle_in("following_servers", %{"name" => name}, socket) do
    case Repo.one(User.local_user_by_name(name)) do
      nil -> {:reply, :error, socket}
      user ->
        query = Server.following(user)
        servers = Repo.all(query)
        {:reply, {:ok, %{user: user, servers: servers}}, socket}
    end
  end

  def handle_in("ping", _params, socket) do
    {:reply, :ok, socket}
  end
end
