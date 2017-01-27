defmodule Share.PostHandler do
  alias Share.Repo
  alias Share.User
  alias Share.Post
  alias Share.PostAddress
  alias Share.Follow
  import Ecto.Query

  defp get_post(post) do
    Repo.one!(from p in Post, where: p.id == ^post.id, preload: ^Post.preload_params)
  end

  def handle_address(post, address, socket) do
    post = Post.preload(post)
    spawn(fn ->
      post = if String.length(address) >= 1 do
        case Repo.get_by(User, name: address) do
          nil -> ()
          user ->
            params = %{user_id: user.id, post_id: post.id}
            changeset = PostAddress.changeset(%PostAddress{}, params)
            Repo.insert!(changeset)
            post = get_post(post)
            Share.Notice.add_address_notice(post)
            post
        end
      else
        post
      end
      spawn(fn ->
        query = from f in Follow,
          join: user in User,
          on: user.id == f.user_id,
          where: f.target_user_id == ^post.user.id,
          select: user
        Repo.all(query)
        |> Enum.map(fn user ->
          spawn(fn ->
            topic = "user:" <> user.name
            Share.Endpoint.broadcast! topic, "add_new_posts", %{posts: [post]}
          end)
        end)
      end)
      spawn(fn -> if not is_nil(post.post_id) do
        query = from p in Post, where: p.id == ^post.post_id
        case Repo.aggregate(query, :count, :id) do
          1 ->
            Share.Notice.add_reply_notice(post)
          _ -> ()
        end
      end end)
      spawn(fn ->
        topic = "user:" <> post.user.name
        Share.Endpoint.broadcast! topic, "add_new_posts", %{posts: [post]}
      end)
    end)
  end
end
