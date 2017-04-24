defmodule Share.Remote.Pusher do
  require Logger

  @message_keys ~w(id action payload reply_to)a

  def enqueue(message) do
    {:push, [message]}
    |> Honeydew.async(:request_pusher)
  end

  defp format(message) do
    message
    |> Map.take(@message_keys)
  end

  def push(message) do
    Share.Remote.Socket.send(message.socket, [format(message)])
  end
end
