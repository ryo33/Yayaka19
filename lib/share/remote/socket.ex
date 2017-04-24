defmodule Share.Remote.Socket do
  use GenServer

  defstruct [:host, :type, :pid, :channel]

  @port Application.get_env(:share, Share.Endpoint)[:url][:port]

  @reconnect_timer 10000
  @reconnect_times 50

  def connect_from(host) do
    %__MODULE__{
      host: host,
      type: :from
    }
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
    {:ok, pid} = PhoenixChannelClient.start_link()
    {:ok, socket} = PhoenixChannelClient.connect(pid, opts)
    channel = PhoenixChannelClient.channel(socket, host, %{port: @port})
    GenServer.start_link(__MODULE__, %{channel: channel, host: host})
    %__MODULE__{
      host: host,
      type: :to,
      pid: pid,
      channel: channel
    }
  end

  def send(socket, messages) do
    case socket.type do
      :from ->
        Share.Endpoint.broadcast! socket.host, "messages", %{messages: messages}
      :to ->
        PhoenixChannelClient.push(socket.channel, "messages", %{messages: messages})
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

  # Callbacks

  def init(%{channel: channel} = opts) do
    case PhoenixChannelClient.join(channel) do
      {:ok, _} -> {:ok, opts}
      {:error, %{reason: reason}} -> {:stop, reason}
      :timeout -> {:stop, :timeout}
    end
  end

  def handle_info({"messages", %{"messages" => messages}}, %{channel: channel, host: host} = state) do
    Enum.each(messages, fn message ->
      spawn fn ->
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

  def terminate(:close, %{host: host}) do
    Share.Remote.SocketServer.delete_socket(host)
    {:shutdown, :close}
  end
end
