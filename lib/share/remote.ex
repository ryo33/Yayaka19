defmodule Share.Remote do
  use Supervisor

  [pusher_workers: pusher_workers] = Application.get_env(:share, Share.Remote)
  @pusher_workers pusher_workers

  def start_link do
    Supervisor.start_link(__MODULE__, [])
  end

  def init(_args) do
    children = [
      Honeydew.queue_spec(:request_handler),
      Honeydew.worker_spec(:request_handler, Share.Remote.Handler, num: 1),
      Honeydew.queue_spec(:request_pusher),
      Honeydew.worker_spec(:request_pusher, Share.Remote.Pusher, num: @pusher_workers),
      worker(Share.Remote.RequestServer, []),
      worker(Share.Remote.SocketServer, [])
    ]

    supervise(children, strategy: :one_for_one)
  end

  @host Application.get_env(:share, Share.Endpoint)[:url][:host]
  @port Application.get_env(:share, Share.Endpoint)[:url][:port]

  if Mix.env == :dev do
    def port, do: Application.get_env(:share, Share.Endpoint)[:url][:port]
    def host, do: "#{@host}:#{port}"
  else
    def port, do: @port
    def host, do: @host
  end

  def remove_port(host) do
    hd(String.split(host, ":"))
  end
  def create_host(host, port) do
    "#{remove_port(host)}:#{port}"
  end
end
