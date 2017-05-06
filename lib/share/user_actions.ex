defmodule Share.UserActions do
  import Ecto.Query
  alias Share.Repo
  alias Share.Follow
  alias Share.Server
  alias Share.User
  alias Share.Post

  def post(user, params, address \\ "") do
    params = params
             |> Map.put("user_id", user.id)
             |> Map.put("user_display", user.display)
    text = Map.get(params, "text")
    post_id = Map.get(params, "post_id")
    mystery_id = Map.get(params, "mystery_id")
    if is_nil(mystery_id) and is_nil(post_id) and text == "" do
      :error
    else
      changeset = Post.changeset(%Post{}, params)
      post = Repo.insert!(changeset)
      Share.Handlers.Post.handle(post, address)
      :ok
    end
  end

  def follow(user_id, target_id) do
    query = Follow.get_follow(user_id, target_id)
    with true <- user_id != target_id,
         0 <- Repo.aggregate(query, :count, :id),
         params <- %{user_id: user_id, target_user_id: target_id},
         changeset <- Follow.changeset(%Follow{}, params),
         {:ok, follow} <- Repo.insert(changeset) do
      {:ok, follow}
    else
      1 -> :already
      _ -> :error
    end
  end

  def unfollow(user_id, target_id) do
    query = Follow.get_follow(user_id, target_id)
    case Repo.one(query) do
      nil -> :already
      follow -> case Repo.delete(follow) do
        {:ok, _} -> :ok
        _ -> :error
      end
    end
  end

  def remote_follow(user_id, host, name) do
    server = Server.from_host(host)
    user = Repo.get!(User, user_id)
           |> Share.User.put_path()
    resp = Share.Remote.Message.create(host, "remote_follow", %{user: user, name: name})
           |> Share.Remote.RequestServer.request()
    case resp do
      {:ok, %{"payload" => %{"user" => user}}} ->
        target_user = User.from_remote_user(server, user)
        case follow(user_id, target_user.id) do
          {:ok, _} -> :ok
          :already -> :ok
          :error ->
            :error
        end
      _ -> :error
    end
  end

  def remote_unfollow(user_id, host, name) do
    query = User.remote_user_by_name(host, name)
    with user when not is_nil(user) <- Repo.one(query),
         user <- Share.User.put_path(user),
         x when x in [:ok, :already] <- unfollow(user_id, user.id),
         message <- Share.Remote.Message.create(host, "remote_unfollow",
                                                %{user: user, name: name}),
         {:ok, %{"payload" => true}} <- Share.Remote.RequestServer.request(message) do
      :ok
    else
      _ -> :error
    end
  end
end
