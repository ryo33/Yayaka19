defmodule Share.APIHandler do
  alias Share.Post
  alias Share.Repo

  def post(user, params) do
    with {_, %{"text" => text}} <- {:invalid, params},
         post_id <- Map.get(params, :post_id),
         address <- Map.get(params, :address, ""),
         {_, true} <- {:invalid, is_nil(post_id) or String.length(address) == 0},
         changeset <- Post.changeset(%Post{}, Map.put(params, "user_id", user.id)),
         {_, {:ok, post}} <- {:insert, Repo.insert(changeset)} do
      Share.PostHandler.handle(post, address)
      {:ok, 200, %{post_id: post.id}}
    else
      {:invalid, _} ->
        {:error, 400, %{reason: "invalid"}}
      {:insert, _} ->
        {:error, 500, %{reason: "failed to insert"}}
    end
  end
end

