defmodule Share.RemoteChannel do
  use Share.Web, :channel

  require Logger

  def join(host, %{"token" => token} = params, socket) do
    port = Map.get(params, "port")
    url = if is_nil(port) do
      "#{host}/yayaka/token"
    else
      "#{Share.Remote.create_host(host, port)}/yayaka/token"
    end
    params = %{token: token, host: Share.Remote.host}
    with {:ok, {:ok, response}} <- Share.Tasks.HTTP.get(url, params),
         {:ok, true} <- Poison.decode(response.body) do
      Share.Remote.Socket.connect_from(host)
      socket = socket |> assign(:host, host)
      {:ok, socket}
    else
      _ -> {:error, "token"}
    end
  end

  def handle_in("messages", %{"messages" => messages}, socket) do
    Enum.each(messages, fn message ->
      spawn_link fn ->
        message = message |> Map.put("from", socket.assigns.host)
        Share.Remote.Handler.enqueue(message)
      end
    end)
    {:noreply, socket}
  end
end
