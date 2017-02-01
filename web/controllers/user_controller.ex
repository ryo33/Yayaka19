defmodule Share.UserController do
  use Share.Web, :controller

  alias Share.User

  plug Guardian.Plug.EnsureAuthenticated, %{handler: __MODULE__} when action in [
    :edit, :update, :api
  ]

  def new(conn, _params) do
    changeset = User.changeset(%User{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"user" => user_params}) do
    changeset = User.changeset(%User{}, user_params)

    case Repo.insert(changeset) do
      {:ok, _user} ->
        conn
        |> put_flash(:info, "User created successfully.")
        |> redirect(to: "/")
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    user = Repo.get_by!(User, name: id)
    render(conn, "show.html", user: user)
  end

  def edit(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    changeset = User.changeset(user)
    render(conn, "edit.html", user: user, changeset: changeset)
  end

  def update(conn, %{"user" => user_params}) do
    user = Guardian.Plug.current_resource(conn)
    changeset = User.changeset(user, user_params)

    case Repo.update(changeset) do
      {:ok, user} ->
        conn
        |> put_flash(:info, "User updated successfully.")
        |> redirect(to: "/users/#{user.name}")
      {:error, changeset} ->
        render(conn, "edit.html", user: user, changeset: changeset)
    end
  end

  def api(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    render(conn, "api.html", user: user)
  end

  def update_api(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    secret = SecureRandom.urlsafe_base64(32)
    changeset = Ecto.Changeset.change(user, secret: secret)

    case Repo.update(changeset) do
      {:ok, user} ->
        conn
        |> put_flash(:info, "Secret updated successfully.")
        |> redirect(to: user_path(conn, :api))
      {:error, changeset} ->
        conn
        |> redirect(to: user_path(conn, :api))
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Repo.get!(User, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(user)

    conn
    |> put_flash(:info, "User deleted successfully.")
    |> redirect(to: "/")
  end


  def unauthenticated(conn, _params) do
    conn
    |> redirect(to: "/")
  end
end
