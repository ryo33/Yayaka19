defmodule Share.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel "page", Share.PageChannel
  channel "user:*", Share.UserChannel

  ## Transports
  transport :websocket, Phoenix.Transports.WebSocket, timeout: 45_000

  def connect(%{"token" => token}, socket) do
    case Phoenix.Token.verify(Share.Endpoint, "channel", token) do
      {:ok, client} ->
        socket = socket
                 |> assign(:user, client.user)
        {:ok, socket}
      _ -> :error
    end
  end

  def id(_socket), do: nil
end
