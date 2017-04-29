defmodule Share.RemoteSocket do
  use Phoenix.Socket

  ## Channels
  channel "*", Share.RemoteChannel

  ## Transports
  transport :websocket, Phoenix.Transports.WebSocket,
    check_origin: false

  def connect(_params, socket) do
    {:ok, socket}
  end

  def id(_socket), do: nil
end
