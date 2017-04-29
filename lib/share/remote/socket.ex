defmodule Share.Remote.Socket do
  use GenServer

  defstruct [:host, :type, :pid, :channel]

  @reconnect_timer 10000
  @reconnect_times 50

  def connect_from(host) do
    socket = %__MODULE__{
      host: host,
      type: :from
    }
    Share.Remote.SocketServer.put_socket(host, socket)
  end

  def connect_to(host) do
    path = "/yayaka/websocket" # TODO get from server info
    {host, opts} = case String.split(host, ":") do
      [host] ->
        {host,
          [host: host,
           path: path,
           secure: Mix.env == :prod]}
      [host, port] ->
        {"#{host}:#{port}",
          [host: host,
           port: String.to_integer(port),
           path: path,
           secure: Mix.env == :prod]}
    end
    GenServer.start_link(__MODULE__, host: host, opts: opts)
  end

  def send(socket, messages) do
    case socket.type do
      :from ->
        Share.Endpoint.broadcast! socket.host, "messages", %{messages: messages}
      :to ->
        try do
          PhoenixChannelClient.push(socket.channel, "messages", %{messages: messages})
        catch
          _ -> GenServer.stop(socket.pid)
        end
    end
  end

  defp reconnect_loop(socket, n) do
    :timer.sleep(@reconnect_timer)
    case PhoenixChannelClient.reconnect(socket) do
      :ok -> ()
      _ -> if n < @reconnect_times do
        reconnect_loop(socket, n + 1)
      end
    end
  end

  def cleanup(%{host: host, pid: pid}) do
    Share.Remote.SocketServer.delete_socket(host)
    GenServer.stop(pid)
  end

  # Callbacks

  def init([host: host, opts: opts]) do
    {:ok, pid} = PhoenixChannelClient.start_link()
    case PhoenixChannelClient.connect(pid, opts) do
      {:ok, socket} ->
        topic = Share.Remote.host
        token = Phoenix.Token.sign(Share.Endpoint, "remote", host)
        params = %{token: token}
        channel = PhoenixChannelClient.channel(socket, topic, params)
        socket = %__MODULE__{
          host: host,
          type: :to,
          pid: pid,
          channel: channel
        }
        state = %{
          host: host,
          socket: socket,
          pid: pid,
          channel: channel
        }
        case PhoenixChannelClient.join(channel) do
          {:ok, _} ->
            Share.Remote.SocketServer.put_socket(host, socket)
            {:ok, state}
          {:error, reason} ->
            cleanup(state)
            {:stop, reason}
          :timeout ->
            cleanup(state)
            {:stop, :timeout}
        end
      _ ->
        GenServer.stop(pid)
        {:stop, :timeout}
    end
  end

  def handle_info({"messages", %{"messages" => messages}}, %{channel: channel, host: host} = state) do
    Enum.each(messages, fn message ->
      spawn_link fn ->
        message = message |> Map.put("from", host)
        Share.Remote.Handler.enqueue(message)
      end
    end)
    {:noreply, state}
  end

  def handle_info(:close, state) do
    {:stop, :close, state}
  end

  def handle_info(_, state) do
    {:noreply, state}
  end

  def terminate(:close, state) do
    cleanup(state)
    {:shutdown, :close}
  end
end
