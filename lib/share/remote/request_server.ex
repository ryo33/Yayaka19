defmodule Share.Remote.RequestServer do
  use GenServer

  @timeout 5000

  def start_link(_opts \\ []) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def request(message, opts \\ []) do
    noreply = Keyword.get(opts, :noreply, false) or Map.get(message, :noreply, false)
    id = UUID.uuid4()
    pid = self()
    try do
      do_request(message, noreply, id, pid)
    rescue
      _ -> :error
    end
  end

  defp do_request(message, noreply, id, pid) do
    socket = Share.Remote.SocketRegistry.get_or_create_socket(message)
    if not is_nil(socket) do
      message = message
                |> Map.put(:socket, socket)
                |> Map.put(:id, id)
      unless noreply do
        message = message
                  |> Map.put(:reply_pid, pid)
        GenServer.cast(__MODULE__, {:request, message})
      end
      Share.Remote.Pusher.enqueue(message)
      unless noreply do
        receive do
          {:message, message} -> {:ok, message}
        after
          @timeout ->
            GenServer.cast(__MODULE__, {:cancel, message.id})
            :timeout
        end
      else
        :ok
      end
    else
      :error
    end
  end

  def handle_reply(message) do
    GenServer.cast(__MODULE__, {:reply, message})
  end

  defp timer(pid, time) do
    :timer.sleep(time)
    send pid, :timer
    timer(pid, time)
  end

  # Callbacks

  def init(_opts) do
    pid = self()
    spawn_link fn -> timer(pid, 100000) end
    {:ok, %{
      messages: %{},
      new_messages: [],
      old_messages: []
    }}
  end

  def handle_info(:timer, state) do
    old = state.old_messages
    state = state
            |> Map.put(:old_messages, state.new_messages)
            |> Map.put(:new_messages, [])
            |> Map.update!(:messages, fn messages ->
              Map.drop(messages, old)
            end)
    {:noreply, state}
  end

  def handle_cast({:request, message}, state) do
    state = state
            |> Map.update!(:new_messages, fn new ->
              [message.id | new]
            end)
            |> Map.update!(:messages, fn messages ->
              Map.put(messages, message.id, message)
            end)
    {:noreply, state}
  end

  def handle_cast({:cancel, id}, state) do
    state = state
            |> Map.update!(:messages, fn messages ->
              Map.delete(messages, id)
            end)
    {:noreply, state}
  end

  def handle_cast({:reply, message}, state) do
    reply_to = Map.get(message, "reply_to")
    pid = get_in(state, [:messages, reply_to, :reply_pid])
    state = state
            |> Map.update!(:messages, fn messages ->
              Map.delete(messages, reply_to)
            end)
    if not is_nil(pid) do
      send pid, {:message, message}
    end
    {:noreply, state}
  end

  def handle_call({:get, id}, _from, state) do
    message = get_in(state, [:messages, id])
    {:reply, message, state}
  end
end
