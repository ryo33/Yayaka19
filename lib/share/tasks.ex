defmodule Share.Tasks do
  use Supervisor

  [post_workers: post_workers,
   notice_workers: notice_workers,
   http_workers: http_workers,
   remote_workers: remote_workers] = Application.get_env(:share, Share.Tasks)
  @post_workers post_workers
  @notice_workers notice_workers
  @http_workers http_workers
  @remote_workers remote_workers

  def start_link do
    Supervisor.start_link(__MODULE__, [])
  end

  def init(_args) do
    children = [
      Honeydew.queue_spec(:post),
      Honeydew.worker_spec(:post, Share.Tasks.Post, num: @post_workers),
      Honeydew.queue_spec(:notice),
      Honeydew.worker_spec(:notice, Share.Tasks.Notice, num: @notice_workers),
      Honeydew.queue_spec(:http),
      Honeydew.worker_spec(:http, Share.Tasks.HTTP, num: @http_workers),
      Honeydew.queue_spec(:remote),
      Honeydew.worker_spec(:remote, Share.Tasks.Remote, num: @remote_workers)
    ]

    supervise(children, strategy: :one_for_one)
  end
end
