defmodule Share.UserChannel do
  use Share.Web, :channel
  alias Share.Follow
  alias Share.User
  alias Share.Post
  alias Share.PostAddress
  alias Share.Fav
  alias Share.Repo

  require Logger

  def join("user:" <> id, _params, socket) do
    user = socket.assigns.user
    true = id == user.name

    query = from f in Follow,
      select: f.target_user_id,
      where: f.user_id == ^user.id
    following = Repo.all(query)

    query = from fav in Fav,
      join: post in Post,
      on: post.id == fav.post_id,
      where: post.user_id == ^user.id,
      preload: [:user, post: [:user, post_addresses: :user]],
      order_by: [desc: :id],
      limit: 50
    favs = Repo.all(query)
           |> Enum.map(fn fav -> %{id: fav.id, user: fav.user, post: fav.post} end)

    query = from follow in Follow,
      where: follow.target_user_id == ^user.id,
      preload: [:user],
      order_by: [desc: :id],
      limit: 50
    follows = Repo.all(query)
              |> Enum.map(fn follow -> %{id: follow.id, user: follow.user} end)

    query = from post in Post,
      join: address in PostAddress,
      on: post.id == address.post_id,
      where: address.user_id == ^user.id,
      preload: [:user, post_addresses: :user],
      order_by: [desc: :id],
      limit: 50
    addresses = Repo.all(query)

    res = %{
      user: user,
      following: following,
      notice: %{
        fav: user.fav_id,
        follow: user.follow_id,
        address: user.post_address_id
      },
      notices: %{
        favs: favs,
        follows: follows,
        addresses: addresses
      }
    }
    {:ok, res, socket}
  end
end
