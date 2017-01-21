defmodule Share.UserChannel do
  use Share.Web, :channel
  alias Share.User
  alias Share.Post
  alias Share.Repo

  require Logger

  def join("user", _params, socket) do
    res = %{
      user: socket.assigns.user
    }
    {:ok, res, socket}
  end

  def handle_in("new_post", params, socket) do
    user = socket.assigns.user
    true = user != nil

    params = Map.put(params, "user_id", user.id)
    changeset = Post.changeset(%Post{}, params)
    Repo.insert!(changeset)
    {:reply, :ok, socket}
  end
end
