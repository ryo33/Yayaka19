defmodule Share.PostHandler do
  alias Share.Repo
  alias Share.User
  alias Share.Post
  alias Share.PostAddress
  import Ecto.Query

  def handle_address(post, address, socket) do
    if String.length(address) >= 1 do
      query = from u in User, where: u.name == ^address
      case Repo.one(query) do
        nil -> ()
        user ->
          params = %{user_id: user.id, post_id: post.id}
          changeset = PostAddress.changeset(%PostAddress{}, params)
          Repo.insert!(changeset)
          post = post |> Post.preload()
          Share.Notice.add_address_notice(post)
      end
    end
  end
end
