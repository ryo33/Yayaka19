defmodule Share.UserChannel do
  use Share.Web, :channel
  alias Share.UserActions
  alias Share.Follow
  alias Share.User
  alias Share.Post
  alias Share.Fav
  alias Share.Mystery
  alias Share.Server
  alias Share.ServerFollow
  alias Share.Repo

  require Logger

  @timeline_limit 25

  def join("user:" <> name, _params, socket) do
    user = socket.assigns.user
    true = name == user.name

    user_params = get_user_params(user)
    {:ok, %{"userParams" => user_params}, socket}
  end

  def handle_in("edit", %{"user" => params}, socket) do
    user = socket.assigns.user
    user = Repo.get!(User, user.id)
    changeset = User.changeset(user, params)
    case Repo.update(changeset) do
      {:ok, user} ->
        {:reply, {:ok, %{user: user}}, socket}
      {:error, _changeset} ->
        {:reply, {:error, %{user: user}}, socket}
    end
  end

  def handle_in("new_post", params, socket) do
    user = socket.assigns.user
    user = Repo.get!(User, user.id)
    %{"text" => text, "post" => post, "address" => address} = params
    params = %{"text" => text}
    params = if not is_nil(post) do
      id = Map.get(post, "id")
      host = Map.get(post, "host")
      if not is_nil(host) do
        Share.Remote.Message.create(host, "post", %{id: id})
        |> Share.Remote.RequestServer.request()
        |> case do
          {:ok, %{"payload" => %{"post" => post}}} ->
            post = Post.put_host(post, host)
                   |> Post.from_map()
            Map.put(params, "post_id", post.id)
        end
      else
        Map.put(params, "post_id", id)
      end
    else
      params
    end
    params = if not is_nil(address) do
      address = User.from_map(address)
      Map.put(params, "address_user_id", address.id)
    else
      params
    end
    case UserActions.post(user, params) do
      :ok -> {:reply, :ok, socket}
      :error -> {:reply, :error, socket}
    end
  end

  def handle_in("new_mystery", params, socket) do
    user = socket.assigns.user
    user = Repo.get!(User, user.id)
    params = params
             |> Map.put("user_id", user.id)
    changeset = Mystery.changeset(%Mystery{}, params)
    mystery = Repo.insert!(changeset)
              |> Mystery.preload()
    res = %{
      mystery: mystery,
      text: mystery.text
    }
    params = %{"text" => "",
      "mystery_id" => mystery.id,
      "user_id" => user.id}
    case UserActions.post(user, params) do
      :ok -> {:reply, {:ok, res}, socket}
      :error -> {:reply, :error, socket}
    end
  end

  def handle_in("open_mystery", %{"id" => id}, socket) do
    user = socket.assigns.user
    query = from m in Mystery,
      where: m.id == ^id
    mystery = Repo.one(Mystery.preload(query))
    query = from p in Post,
      where: p.user_id == ^user.id,
      where: p.mystery_id == ^mystery.id
    res = %{
      mystery: mystery,
      text: mystery.text
    }
    if user.id != mystery.user_id and Repo.aggregate(query, :count, :id) == 0 do
      # Quote and open
      params = %{"text" => "",
        "mystery_id" => mystery.id,
        "user_id" => user.id}
      case UserActions.post(user, params) do
        :ok -> {:reply, {:ok, res}, socket}
        :error -> {:reply, :error, socket}
      end
    else
      # Open
      {:reply, {:ok, res}, socket}
    end
  end

  def handle_in("fav", %{"id" => id}, socket) do
    user = socket.assigns.user
    query = from f in Fav,
      where: f.user_id == ^user.id,
      where: f.post_id == ^id
    with 0 <- Repo.aggregate(query, :count, :id),
         params <- %{user_id: user.id, post_id: id},
         changeset <- Fav.changeset(%Fav{}, params),
         {:ok, fav} <- Repo.insert(changeset) do
      Share.Handlers.Notice.add_fav_notice(user, fav)
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

  def handle_in("follow", %{"name" => name} = params, socket) do
    user = socket.assigns.user
    host = Map.get(params, "host", nil)
    if not is_nil(host) or host == Share.Remote.host do
      case UserActions.remote_follow(user.id, host, name) do
        :ok -> {:reply, :ok, socket}
        :error -> {:reply, :error, socket}
      end
    else
      target_user = Repo.one!(User.local_user_by_name(name))
      case UserActions.follow(user.id, target_user.id) do
        {:ok, follow} ->
          Share.Handlers.Notice.add_follow_notice(user, follow)
          {:reply, :ok, socket}
        :already -> {:reply, :ok, socket}
        :error ->
          {:reply, :error, socket}
      end
    end
  end

  def handle_in("unfollow", %{"name" => name} = params, socket) do
    user = socket.assigns.user
    host = Map.get(params, "host", nil)
    if not is_nil(host) or host == Share.Remote.host do
      case UserActions.remote_unfollow(user.id, host, name) do
        :ok -> {:reply, :ok, socket}
        :error -> {:reply, :error, socket}
      end
    else
      target_user = Repo.one!(Share.User.local_user_by_name(name))
      case UserActions.unfollow(user.id, target_user.id) do
        :ok -> {:reply, :ok, socket}
        :error -> {:reply, :error, socket}
        :already -> {:reply, :ok, socket}
      end
    end
  end

  def handle_in("follow_server", %{"host" => host}, socket) do
    user = socket.assigns.user
    server = Server.from_host(host)
    query = from f in ServerFollow,
      where: f.user_id == ^user.id,
      where: f.server_id == ^server.id
    with 0 <- Repo.aggregate(query, :count, :id),
         params <- %{user_id: user.id, server_id: server.id},
         changeset <- ServerFollow.changeset(%ServerFollow{}, params),
         {:ok, _follow} <- Repo.insert(changeset) do
      {:reply, {:ok, %{server: server}}, socket}
    else
      _ -> {:reply, :error, socket}
    end
  end

  def handle_in("unfollow_server", %{"id" => id}, socket) do
    user = socket.assigns.user
    query = from f in ServerFollow,
      where: f.user_id == ^user.id,
      where: f.server_id == ^id
    case Repo.one(query) do
      nil -> {:reply, :error, socket}
      follow -> case Repo.delete(follow) do
        {:ok, _} -> {:reply, :ok, socket}
        _ -> {:reply, :error, socket}
      end
    end
  end

  def handle_in("open_notices", %{"noticed" => noticed}, socket) do
    user = socket.assigns.user
    user = Repo.get!(User, user.id)
    {:ok, noticed} = NaiveDateTime.from_iso8601(noticed)
    changeset = Ecto.Changeset.change(user, noticed: noticed)
    case Repo.update(changeset) do
      {:ok, user} ->
        {:reply, {:ok, %{noticed: user.noticed}}, socket}
      _ -> {:reply, :error, socket}
    end
  end

  def handle_in("timeline", _params, socket) do
    user = socket.assigns.user
    timeline = get_timeline(user, with_remotes: true)
    {:reply, {:ok, timeline}, socket}
  end

  def handle_in("more_timeline", %{"id" => id}, socket) do
    user = socket.assigns.user
    timeline = get_timeline(user, [less_than_id: id])
    {:reply, {:ok, timeline}, socket}
  end

  def get_timeline(user, opts \\ []) do
    less_than_id = Keyword.get(opts, :less_than_id)
    with_remotes = Keyword.get(opts, :with_remotes)
    limitation = Keyword.get(opts, :limit, @timeline_limit)
    query = Share.Follow.get_following_ids(user.id)
    users = [user.id | Repo.all(query)]
    query = Post.timeline(users)
            |> limit(^limitation)
    query = if is_nil(less_than_id) do
      query
    else
      where(query, [p], p.id < ^less_than_id)
    end
    posts = Repo.all(query)
    favs = Fav.get_favs(posts, user)
    if (with_remotes) do
      remote_following = Follow.remote_following(user.id) |> Repo.all()
      get_host = fn follow -> follow.target_user.server.host end
      hosts = Enum.group_by(remote_following, get_host)
      remotes = Enum.map(hosts, fn {host, _v} -> host end)
      Enum.each(remotes, fn host ->
        Share.Tasks.Remote.fetch_timeline(host, user)
      end)
      remotes = Enum.map(remotes, fn host -> {host, nil} end)
                |> Enum.into(%{})
      %{posts: posts, favs: favs, remotes: remotes}
    else
      %{posts: posts, favs: favs}
    end
  end

  defp get_user_params(user) do
    user = Repo.get!(User, user.id)

    query = from u in User,
      where: u.provider == ^user.provider,
      where: u.provided_id == ^user.provided_id,
      where: u.id != ^user.id
    users = Repo.all(query)

    query = from f in Follow,
      preload: [target_user: [:server]],
      where: f.user_id == ^user.id
    following = Repo.all(query)
    map = Enum.group_by(following, fn follow ->
      user = follow.target_user
      if user.server_id == nil, do: :following, else: :remote
    end, fn follow ->
      user = follow.target_user
      if user.server_id == nil, do: user.name, else: [user.server.host, user.name]
    end)
    following = Map.get(map, :following, [])
    remote_following = Map.get(map, :remote, [])

    query = from fav in Fav,
      join: post in Post,
      on: post.id == fav.post_id,
      where: post.user_id == ^user.id,
      where: fav.user_id != ^user.id,
      order_by: [desc: :id],
      limit: 50
    favs = Repo.all(Fav.preload(query))
           |> Enum.map(fn fav -> %{id: fav.id, user: fav.user, post: fav.post, inserted_at: fav.inserted_at} end)

    query = from follow in Follow,
      where: follow.target_user_id == ^user.id,
      order_by: [desc: :id],
      limit: 50
    follows = Repo.all(Follow.preload(query))
              |> Enum.map(fn follow -> %{id: follow.id, user: follow.user, inserted_at: follow.inserted_at} end)

    query = from follow in Follow,
      where: follow.target_user_id == ^user.id,
      select: follow.user_id
    followers = Repo.all(query)

    query = from post in Post,
      where: post.address_user_id == ^user.id,
      where: post.user_id != ^user.id,
      where: is_nil(post.post_id),
      order_by: [desc: :id],
      limit: 50
    addresses = Repo.all(Post.preload(query))

    query = from post in Post,
      where: post.address_user_id == ^user.id,
      where: post.user_id != ^user.id,
      where: not is_nil(post.post_id),
      order_by: [desc: :id],
      limit: 50
    replies = Repo.all(Post.preload(query))

    timeline = get_timeline(user, with_remotes: true)

    %{
      user: user,
      users: users,
      timeline: timeline,
      following: following,
      remoteFollowing: remote_following,
      followers: followers,
      noticed: user.noticed,
      notices: %{
        favs: favs,
        follows: follows,
        addresses: addresses,
        replies: replies
      }
    }
  end
end
