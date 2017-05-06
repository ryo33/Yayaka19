defmodule Share.Remote.Handler do
  import Ecto.Query

  def enqueue(%{"action" => "reply"} = message) do
    Share.Remote.RequestServer.handle_reply(message)
  end

  def enqueue(message) do
    {:handle, [message]}
    |> Honeydew.async(:request_handler)
  end

  def handle(%{"action" => "public_timeline"} = message) do
    posts = Share.Post.public_timeline()
            |> Share.Repo.all()
            |> Enum.map(&Share.Post.put_path(&1))
    payload = %{
      posts: posts
    }
    Share.Remote.Message.create_reply(message, payload)
    |> Share.Remote.RequestServer.request()
  end

  def handle(%{"action" => "remote_follow"} = message) do
    %{"payload" => %{"user" => user, "name" => name},
      "from" => host} = message
    server = Share.Server.from_host(host)
    user = Share.User.from_remote_user(server, user)
    target = Share.Repo.one!(Share.User.local_user_by_name(name))
             |> Share.User.put_path()
    case Share.UserActions.follow(user.id, target.id) do
      {:ok, follow} ->
        Share.Handlers.Notice.add_follow_notice(user, follow)
      :already ->
        :ok
    end
    Share.Remote.Message.create_reply(message, %{user: target})
    |> Share.Remote.RequestServer.request()
  end

  def handle(%{"action" => "remote_unfollow"} = message) do
    %{"payload" => %{"user" => user, "name" => name},
      "from" => host} = message
    server = Share.Server.from_host(host)
    user = Share.User.from_remote_user(server, user)
    target = Share.Repo.one!(Share.User.local_user_by_name(name))
    case Share.UserActions.unfollow(user.id, target.id) do
      :ok -> :ok
      :already -> :ok
    end
    Share.Remote.Message.create_reply(message, true)
    |> Share.Remote.RequestServer.request()
  end

  @timeline_limitation 100
  def handle(%{"action" => "timeline"} = message) do
    %{"payload" => %{"user" => user}, "from" => host} = message
    server = Share.Server.from_host(host)
    user = Share.User.from_remote_user(server, user)
    users = Share.Follow.get_following_ids(user.id)
            |> Share.Repo.all()
    query = Share.Post.timeline(users)
            |> limit(^@timeline_limitation)
    posts = Share.Repo.all(query)
            |> Enum.map(&Share.Post.put_path(&1))
    Share.Remote.Message.create_reply(message, %{posts: posts})
    |> Share.Remote.RequestServer.request()
  end

  def handle(%{"action" => "add_new_posts"} = message) do
    %{"payload" => %{"posts" => posts}, "from" => host} = message
    posts = Enum.map(posts, fn post -> Map.put(post, "host", host) end)
    Enum.each(posts, fn post ->
      server = Share.Server.from_host(host)
      user = Share.User.from_remote_user(server, Map.get(post, "user"))
      Share.Tasks.Post.broadcast_to_followers(post, user)
    end)
  end

  def handle(%{"action" => "user_info"} = message) do
    %{"payload" => %{"name" => name},
      "from" => host} = message
    user = Share.Repo.one!(Share.User.local_user_by_name(name))
    info = Share.UserActions.remote_user_info(user)
    Share.Remote.Message.create_reply(message, %{info: info})
    |> Share.Remote.RequestServer.request()
  end

  def handle(_) do
    :ok
  end
end
