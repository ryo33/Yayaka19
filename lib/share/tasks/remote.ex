defmodule Share.Tasks.Remote do

  def fetch_timeline(host, user) do
    {:do_fetch_timeline, [host, user]}
    |> Honeydew.async(:remote)
  end

  def do_fetch_timeline(host, user) do
    topic = "user:" <> user.name
    Share.Remote.Message.create(host, "timeline", %{user: user})
    |> Share.Remote.RequestServer.request()
    |> case do
      {:ok, %{"payload" => %{"posts" => posts}, "from" => host}} ->
        posts = Enum.map(posts, &Share.Post.put_host(&1, host))
        Share.Endpoint.broadcast! topic, "remote_timeline", %{host: host, posts: posts}
      :timeout ->
        Share.Endpoint.broadcast! topic, "remote_timeline_timeout", %{host: host}
      :error ->
        Share.Endpoint.broadcast! topic, "remote_timeline_error", %{host: host}
    end
  end
end
