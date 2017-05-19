defmodule Share.Remote.Handler do
  import Ecto.Query

  require Logger

  def enqueue(%{"action" => "reply"} = message) do
    Share.Remote.RequestServer.handle_reply(message)
  end

  def enqueue(message) do
    {:handle, [message]}
    |> Honeydew.async(:request_handler)
  end

  def handle(%{"action" => "remote_follow"} = message) do
    %{"payload" => %{"user" => user, "name" => name},
      "from" => host} = message
    server = Share.Server.from_host(host)
    user = Share.User.from_remote_user(server, user)
    target = Share.Repo.one!(Share.User.local_user_by_name(name))
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
    posts = Enum.map(posts, &Share.Post.put_host(&1, host))
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

  def handle(%{"action" => "post"} = message) do
    %{"payload" => %{"id" => id},
      "from" => host} = message
    post = Share.Repo.get!(Share.Post, id)
           |> Share.Post.preload()
           |> Share.Post.put_path()
    Share.Remote.Message.create_reply(message, %{post: post})
    |> Share.Remote.RequestServer.request()
  end

  def handle(%{"action" => "add_address_notice"} = message) do
    %{"payload" => %{"post" => post, "user" => user},
      "from" => host} = message
    server = Share.Server.from_host(host)
    post = Share.Post.put_host(post, host)
    post = Share.Post.from_remote_post(server, post)
    user = Share.User.local_user_by_name(Map.get(user, "name"))
           |> Share.Repo.one!()
    Share.Handlers.Post.add_address_notice(post, user)
  end

  def handle(%{"action" => "add_reply_notice"} = message) do
    %{"payload" => %{"post" => post, "user" => user},
      "from" => host} = message
    server = Share.Server.from_host(host)
    post = Share.Post.put_host(post, host)
    post = Share.Post.from_remote_post(server, post)
    user = Share.User.local_user_by_name(Map.get(user, "name"))
           |> Share.Repo.one!()
    Share.Handlers.Post.add_reply_notice(post, user)
  end

  def handle(%{"action" => "open_mystery"} = message) do
    %{"payload" => %{"id" => id},
      "from" => host} = message
    mystery = Share.Mystery.local_mystery_by_id(id)
              |> Share.Mystery.preload()
              |> Share.Repo.one!()
    server = Share.Server.from_host(host)
    trust = Share.Repo.get_by(Share.ServerTrust,
                              user_id: mystery.user_id,
                              server_id: server.id)
    if is_nil(trust) do
      Share.Remote.Message.create_reply(message, %{mystery: mystery})
      |> Share.Remote.RequestServer.request()
    else
      text = mystery.text
      mystery = Share.Mystery.put_path(mystery)
      Share.Remote.Message.create_reply(message, %{mystery: mystery, text: text})
      |> Share.Remote.RequestServer.request()
    end
  end

  def handle(message) do
    Logger.debug(inspect message)
    :ok
  end
end
