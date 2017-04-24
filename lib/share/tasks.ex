defmodule Share.Tasks do
  use Supervisor

  [post_workers: post_workers,
   online_post_workers: online_post_workers,
   notice_workers: notice_workers] = Application.get_env(:share, Share.Tasks)
  @post_workers post_workers
  @online_post_workers online_post_workers
  @notice_workers notice_workers

  def start_link do
    Supervisor.start_link(__MODULE__, [])
  end

  def init(_args) do
    children = [
      Honeydew.queue_spec(:post),
      Honeydew.worker_spec(:post, Share.Tasks.Post, num: @post_workers),
      Honeydew.queue_spec(:online_post),
      Honeydew.worker_spec(:online_post, Share.Tasks.OnlinePost, num: @online_post_workers),
      Honeydew.queue_spec(:notice),
      Honeydew.worker_spec(:notice, Share.Tasks.Notice, num: @notice_workers)
    ]

    supervise(children, strategy: :one_for_one)
  end
end
