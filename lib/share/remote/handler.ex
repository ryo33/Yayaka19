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
            |> Enum.map(fn post ->
              path = Share.Router.Helpers.page_path(Share.Endpoint, :post, post.id)
              post = Share.Post.to_map(post)
                     |> Map.put(:path, path)
            end)
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
