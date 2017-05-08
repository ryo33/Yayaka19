defmodule Share.UserController do
  use Share.Web, :controller

  alias Share.User

  plug Guardian.Plug.EnsureAuthenticated, %{handler: __MODULE__} when action in [
    :api, :update_api, :password, :update_password
  ]

  def api(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    render(conn, "api.html", user: user)
  end

  def update_api(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    secret = SecureRandom.urlsafe_base64(32)
    changeset = Ecto.Changeset.change(user, secret: secret)

    case Repo.update(changeset) do
      {:ok, _user} ->
        conn
        |> put_flash(:info, "Secret updated successfully.")
        |> redirect(to: user_path(conn, :api))
      {:error, _changeset} ->
        conn
        |> redirect(to: user_path(conn, :api))
    end
  end

  def password(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    changeset = User.password_changeset(user)
    render(conn, "password.html", changeset: changeset, user: user)
  end

  def update_password(conn, %{"user" => params}) do
    user = Guardian.Plug.current_resource(conn)
    changeset = User.password_changeset(user, params)
    case Repo.update(changeset) do
      {:ok, _user} ->
        conn
        |> redirect(to: "/")
      {:error, changeset} ->
        render(conn, "password.html", changeset: changeset, user: user)
    end
  end

  def unauthenticated(conn, _params) do
    conn
    |> redirect(to: "/")
  end
end
