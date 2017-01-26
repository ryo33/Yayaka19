defmodule Share.PostHandler do
  alias Share.Repo
  alias Share.User
  alias Share.Post
  alias Share.PostAddress
  import Ecto.Query

  def handle_address(post, address, socket) do
    Task.start(fn -> if String.length(address) >= 1 do
      case Repo.get_by(User, name: address) do
        nil -> ()
        user ->
          params = %{user_id: user.id, post_id: post.id}
          changeset = PostAddress.changeset(%PostAddress{}, params)
          Repo.insert!(changeset)
          post = Post.preload(post)
          Share.Notice.add_address_notice(post)
      end
    end end)
    Task.start(fn -> if not is_nil(post.post_id) do
      query = from p in Post, where: p.id == ^post.post_id
      case Repo.aggregate(query, :count, :id) do
        1 ->
          post = Post.preload(post)
          Share.Notice.add_reply_notice(post)
        _ -> ()
      end
    end end)
  end
end
