defmodule Share.RemoteChannel do
  use Share.Web, :channel

  require Logger

  def join(host, %{"port" => port}, socket) do
    # TODO checkout
    # get "#{remove_port(host)}:#{port}/yayaka/check"
    sock = Share.Remote.Socket.connect_from(host)
    Share.Remote.SocketServer.put_socket(host, sock)
    socket = socket |> assign(:host, "#{host}")
    {:ok, socket}
  end

  def handle_in("messages", %{"messages" => messages}, socket) do
    Enum.each(messages, fn message ->
      spawn fn ->
        message = message |> Map.put("from", socket.assigns.host)
        Share.Remote.Handler.enqueue(message)
      end
    end)
    {:noreply, socket}
  end
end
