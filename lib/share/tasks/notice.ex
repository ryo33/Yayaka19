defmodule Share.Tasks.Notice do
  alias Share.Repo
  alias Share.Post
  alias Share.Fav
  alias Share.Follow
  import Ecto.Query

  def post(post) do
    address = post.address_user
    if not is_nil(address) do
      if is_nil(post.post_id) do
        if is_nil(address.server_id) do
          {:add_address_notice, [post, address]}
          |> Honeydew.async(:notice)
        else
          post = Post.put_path(post)
          payload = %{post: post, user: address}
          host = Repo.preload(address, [:server]).server.host
          Share.Remote.Message.create(host, "add_address_notice", payload)
          |> Share.Remote.RequestServer.request(noreply: true)
        end
      else
        post = Share.Repo.preload(post, [post: Share.Post.preload_params])
        if is_nil(address.server_id) do
          {:add_reply_notice, [post, address]}
          |> Honeydew.async(:notice)
        else
          post = Post.put_path(post)
          payload = %{post: post, user: address}
          host = Repo.preload(address, [:server]).server.host
          Share.Remote.Message.create(host, "add_reply_notice", payload)
          |> Share.Remote.RequestServer.request(noreply: true)
        end
      end
    end
  end

  def add_fav_notice(user, fav) do
    fav = Fav.preload(fav)
    target_user = fav.post.user
    if target_user.id != fav.user_id do
      payload = %{
        favs: [%{id: fav.id, user: fav.user, post: fav.post, inserted_at: fav.inserted_at}]
      }
      |> format_notices
      Share.Endpoint.broadcast! "user:" <> target_user.name, "add_notices", payload
    end
  end

  def add_follow_notice(user, follow) do
    follow = Follow.preload(follow)
    target_user = follow.target_user
    payload = %{
      follows: [%{id: follow.id, user: user, inserted_at: follow.inserted_at}]
    }
    |> format_notices
    Share.Endpoint.broadcast! "user:" <> target_user.name, "add_notices", payload
  end

  def add_address_notice(post, target_user) do
    if target_user.id != post.user_id do
      payload = %{addresses: [post]}
      |> format_notices
      Share.Endpoint.broadcast! "user:" <> target_user.name, "add_notices", payload
    end
  end

  def add_reply_notice(post, user) do
    if user.id != post.user_id do
      payload = %{replies: [post]}
      |> format_notices
      Share.Endpoint.broadcast! "user:" <> user.name, "add_notices", payload
    end
  end

  defp format_notices(notices) do
    notices
    |> Map.put_new(:favs, [])
    |> Map.put_new(:follows, [])
    |> Map.put_new(:addresses, [])
    |> Map.put_new(:replies, [])
  end
end
