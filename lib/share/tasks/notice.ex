defmodule Share.Tasks.Notice do
  alias Share.Repo
  alias Share.Post
  alias Share.Fav
  alias Share.Follow
  import Ecto.Query

  def post(post) do
    if length(post.post_addresses) >= 1 do
      if is_nil(post.post_id) do
        {:add_address_notice, [post]}
        |> Honeydew.async(:notice)
      else
        query = from p in Post, where: p.id == ^post.post_id
        case Repo.aggregate(query, :count, :id) do
          1 ->
            {:add_reply_notice, [post]}
            |> Honeydew.async(:notice)
          _ -> ()
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

  def add_address_notice(post) do
    target_user = hd(post.post_addresses).user
    if target_user.id != post.user_id do
      payload = %{addresses: [post]}
      |> format_notices
      Share.Endpoint.broadcast! "user:" <> target_user.name, "add_notices", payload
    end
  end

  def add_reply_notice(post) do
    post = Share.Repo.preload(post, [post: Share.Post.preload_params])
    target_user = post.post.user
    if target_user.id != post.user_id do
      payload = %{replies: [post]}
      |> format_notices
      Share.Endpoint.broadcast! "user:" <> target_user.name, "add_notices", payload
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
