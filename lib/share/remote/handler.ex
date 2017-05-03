defmodule Share.Remote.Handler do
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
    reply = Share.Remote.Message.create_reply(message, payload)
    Share.Remote.RequestServer.request(reply)
  end

  def handle(_) do
    :ok
  end
end
