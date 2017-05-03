defmodule Share.Remote.SocketRegistry do
  def start_link do
    Registry.start_link(:unique, __MODULE__)
  end

  def get_or_create_socket(message) do
    host = message.host
    case get_socket(host) do
      nil ->
        Share.Remote.Socket.connect_to(host)
        get_socket(host)
      socket -> socket
    end
  end

  def get_socket(host) do
    case Registry.lookup(__MODULE__, host) do
      [{_pid, socket}] -> socket
      _ -> nil
    end
  end
end
