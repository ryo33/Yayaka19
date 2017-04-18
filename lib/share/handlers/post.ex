defmodule Share.Handlers.Post do
  def handle(post, address) do
    if Mix.env != :test do
      {:post, [post, address]}
      |> Honeydew.async(:post)
    end
  end
end
