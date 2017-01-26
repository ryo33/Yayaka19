defmodule Share.Notice do
  def add_fav_notice(user, fav) do
    target_user = fav.post.user
    payload = %{
      favs: [%{id: fav.id, user: fav.user, post: fav.post, inserted_at: fav.inserted_at}]
    }
    |> format_notices
    Share.Endpoint.broadcast! "user:" <> target_user.name, "add_notices", payload
  end

  def add_follow_notice(user, follow) do
    target_user = follow.target_user
    payload = %{
      follows: [%{id: follow.id, user: user, inserted_at: follow.inserted_at}]
    }
    |> format_notices
    Share.Endpoint.broadcast! "user:" <> target_user.name, "add_notices", payload
  end

  def add_address_notice(post) do
    target_user = hd(post.post_addresses).user
    payload = %{addresses: [post]}
    |> format_notices
    Share.Endpoint.broadcast! "user:" <> target_user.name, "add_notices", payload
  end

  def add_reply_notice(post) do
    post = Share.Repo.preload(post, [post: Share.Post.preload_params])
    target_user = post.post.user
    payload = %{replies: [%{id: post.id, post: post, target: post.post, inserted_at: post.inserted_at}]}
    |> format_notices
    Share.Endpoint.broadcast! "user:" <> target_user.name, "add_notices", payload
  end

  defp format_notices(notices) do
    notices
    |> Map.put_new(:favs, [])
    |> Map.put_new(:follows, [])
    |> Map.put_new(:addresses, [])
    |> Map.put_new(:replies, [])
  end
end
