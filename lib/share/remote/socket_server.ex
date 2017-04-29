defmodule Share.Remote.SocketServer do
  use GenServer

  def start_link(_opts \\ []) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def put_socket(host, socket) do
    GenServer.cast(__MODULE__, {:put, host, socket})
  end

  def get_socket(message) do
    host = message.host
    socket = GenServer.call(__MODULE__, {:get, host})
    if is_nil(socket) do
      Share.Remote.Socket.connect_to(host)
      GenServer.call(__MODULE__, {:get, host})
    else
      socket
    end
  end

  def delete_socket(host) do
    GenServer.cast(__MODULE__, {:delete, host})
  end

  # Callbacks

  def init(_opts) do
    {:ok, %{}}
  end

  def handle_cast({:put, host, socket}, state) do
    {:noreply, Map.put(state, host, socket)}
  end

  def handle_cast({:delete, host}, state) do
    {:noreply, Map.delete(state, host)}
  end

  def handle_call({:get, host}, _from, state) do
    {:reply, Map.get(state, host), state}
  end
end
