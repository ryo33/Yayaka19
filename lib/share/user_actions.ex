defmodule Share.UserActions do
  import Ecto.Query
  alias Share.Repo
  alias Share.Follow
  alias Share.Server
  alias Share.User
  alias Share.Post
  alias Share.Fav
  alias Share.Mystery

  def post(user, params) do
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
      Share.Handlers.Post.handle(post)
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

  def remote_user_info(user, request_user \\ nil) do
    user_info(user, request_user)
    |> Map.update!("user", fn user -> User.put_path(user) end)
    |> Map.update!("posts", fn posts -> Enum.map(posts, &Post.put_path(&1)) end)
  end

  @user_posts_limit 10
  def user_info(user, request_user \\ nil) do
    query = from p in Post, where: p.user_id == ^user.id
    post_count = Repo.aggregate(query, :count, :id)
    query = from f in Follow, where: f.user_id == ^user.id
    follow_count = Repo.aggregate(query, :count, :id)
    query = from f in Follow, where: f.target_user_id == ^user.id
    followed_count = Repo.aggregate(query, :count, :id)
    query = from p in Post,
      where: p.user_id == ^user.id,
      order_by: [desc: :id],
      limit: @user_posts_limit
    posts = Repo.all(Post.preload(query))
    favs = Fav.get_favs(posts, request_user)
    mysteries_count = Repo.aggregate(Mystery.user_mysteries(user), :count, :id)
    opened_mysteries_count = Repo.aggregate(Post.opened_mystery_posts(user), :count, :id)
    %{
      "user" => user,
      "posts" => posts,
      "favs" => favs,
      "postCount" => post_count,
      "following" => follow_count,
      "followers" => followed_count,
      "mysteries" => mysteries_count,
      "openedMysteries" => opened_mysteries_count
    }
  end

  def open_mystery(user, mystery) do
    query = from p in Post,
      where: p.user_id == ^user.id,
      where: p.mystery_id == ^mystery.id
    if user.id != mystery.user_id and Repo.aggregate(query, :count, :id) == 0 do
      params = %{"text" => "",
        "mystery_id" => mystery.id,
        "user_id" => user.id}
      post(user, params)
    else
      :ok
    end
  end
end
