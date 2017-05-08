defmodule Share.Handlers.Post do
  def handle(post) do
    if Mix.env != :test do
      {:post, [post]}
      |> Honeydew.async(:post)
    end
  end

  def add_address_notice(post, user) do
    {:add_address_notice, [post, user]}
    |> Honeydew.async(:notice)
  end

  def add_reply_notice(post, user) do
    {:add_reply_notice, [post, user]}
    |> Honeydew.async(:notice)
  end
end
