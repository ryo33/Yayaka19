defmodule Share.Handlers.Notice do
  def post(post) do
    {:post, [post]}
    |> Honeydew.async(:notice)
  end

  def add_fav_notice(user, fav) do
    {:add_fav_notice, [user, fav]}
    |> Honeydew.async(:notice)
  end

  def add_follow_notice(user, follow) do
    {:add_follow_notice, [user, follow]}
    |> Honeydew.async(:notice)
  end
end
