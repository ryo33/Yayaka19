defmodule Share.Notice do
  def add_fav_notice(user, fav) do
    target_user = fav.post.user
    payload = %{
      favs: %{id: fav.id, user: fav.user, post: fav.post, inserted_at: fav.inserted_at},
      follows: [],
      addresses: []
    }
    Share.Endpoint.broadcast! "user:" <> target_user.name, "add_notices", payload
  end

  def add_follow_notice(user, follow) do
    target_user = follow.target_user
    payload = %{
      favs: [],
      follows: %{id: follow.id, user: user, inserted_at: follow.inserted_at},
      addresses: []
    }
    Share.Endpoint.broadcast! "user:" <> target_user.name, "add_notices", payload
  end

  def add_address_notice(post) do
    target_user = hd(post.post_addresses).user
    payload = %{
      favs: [],
      follows: [],
      addresses: [post]
    }
    Share.Endpoint.broadcast! "user:" <> target_user.name, "add_notices", payload
  end
end
