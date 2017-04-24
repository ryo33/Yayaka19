defmodule Share.Remote.Handler do
  def enqueue(%{"action" => "reply"} = message) do
    Share.Remote.RequestServer.handle_reply(message)
  end

  def enqueue(message) do
    {:handle, [message]}
    |> Honeydew.async(:request_handler)
  end


  def handle(message) do
    reply = Share.Remote.Message.create_reply(message, "ok")
    Share.Remote.RequestServer.request(reply)
  end
end
