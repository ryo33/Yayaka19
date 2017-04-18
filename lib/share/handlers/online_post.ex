defmodule Share.Handlers.OnlinePost do
  def handle(post, user) do
    {:broadcast_to_user, [post, user]}
    |> Honeydew.async(:online_post)
    {:broadcast_to_followers, [post, user]}
    |> Honeydew.async(:online_post)
  end
end
