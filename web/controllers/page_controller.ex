defmodule Share.PageController do
  use Share.Web, :controller

  @max_length 64

  def terms(conn, _params) do
    render(conn, "terms.html")
  end

  def privacy(conn, _params) do
    render(conn, "privacy.html")
  end

  def index(conn, _params) do
    render_page(conn)
  end

  def post(conn, %{"id" => id}) do
    case Share.Repo.get(Share.Post, id) do
      nil -> render_page(conn)
      post ->
        post = Share.Repo.preload(post, [:user])
        user = post.user
        og = %{
          title: "#{user.display} (@#{user.name})'s post",
          description: ellipsize(post.text),
          url: get_url(conn)
        }
        render_page(conn, og)
    end
  end

  def user(conn, %{"name" => name}) do
    case Share.Repo.get_by(Share.User, name: name) do
      nil -> render_page(conn)
      user ->
        title = Application.get_env(:share, :title)
        og = %{
          title: "#{user.display} (@#{user.name}) on #{title}",
          url: get_url(conn)
        }
        render_page(conn, og)
    end
  end

  def mystery(conn, %{"id" => id}) do
    case Share.Repo.get_by(Share.Mystery, id: id) do
      nil -> render_page(conn)
      mystery ->
        mystery = Share.Repo.preload(mystery, [:user])
        user = mystery.user
        og = %{
          title: "#{user.display} (@#{user.name})'s mystery",
          description: ellipsize(mystery.title),
          url: get_url(conn)
        }
        render_page(conn, og)
    end
  end

  def render_page(conn, og \\ %{}) do
    user = Guardian.Plug.current_resource(conn)
    case user do
      nil ->
        client = %{
          user: nil
        }
        token = Phoenix.Token.sign(Share.Endpoint, "channel", client)
        render conn, "index.html", signed_in: false, token: token, og: og 
      user ->
        client = %{
          user: user
        }
        token = Phoenix.Token.sign(Share.Endpoint, "channel", client)
        render conn, "index.html", signed_in: true, token: token, user_id: user.name, og: og 
    end
  end

  defp get_url(conn) do
    scheme = case conn.scheme do
      :http -> "http"
      :https -> "https"
    end
    host = conn.host
    path = conn.request_path
    "#{scheme}://#{host}#{path}"
  end

  defp ellipsize(nil), do: ""

  defp ellipsize(text) do
    if String.length(text) > @max_length do
      String.slice(text, 0, @max_length - 1) <> "..."
    else
      text
    end
  end
end
