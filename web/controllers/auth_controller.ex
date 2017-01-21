defmodule Share.AuthController do
  use Share.Web, :controller
  plug Ueberauth

  alias Ueberauth.Strategy.Helpers
  alias Share.User

  @providers [:google, :github, :facebook]

  def login_page(conn, _params) do
    render(conn, "login.html")
  end

  def request(conn, _params) do
    render(conn, "request.html", callback_url: Helpers.callback_url(conn))
  end

  def delete(conn, _params) do
    conn
    |> put_flash(:info, "You have been logged out!")
    |> Guardian.Plug.sign_out
    |> redirect(to: "/")
  end

  def callback(%{assigns: %{ueberauth_failure: fails}} = conn, _params) do
    IO.inspect(fails)
    conn
    |> put_flash(:error, "Failed to authenticate.")
    |> redirect(to: "/")
  end

  def callback(%{assigns: %{ueberauth_auth: %{provider: provider, uid: id}}} = conn, _params) when provider in @providers do
    provider = to_string(provider)
    query = from u in User,
      where: u.provider == ^provider and u.provided_id == ^id,
      select: u
    user = case Repo.one(query) do
      nil ->
        changeset = User.changeset(%User{})
        conn
        |> put_session(:auth, %{provider: provider, id: id})
        |> render(Share.UserView, "new.html", changeset: changeset)
      user ->
        conn
        |> put_flash(:info, "Logged In")
        |> login(user)
    end
  end

  def create(conn, %{"user" => params}) do
    %{provider: provider, id: id} = conn |> get_session(:auth)
    %{"name" => name, "display" => display} = params
    changeset = User.changeset(%User{}, %{
      name: name,
      display: display,
      provider: provider,
      provided_id: id,
    })
    case Repo.insert(changeset) do
      {:ok, user} ->
        conn
        |> delete_session(:auth)
        |> put_flash(:info, "User created successfully.")
        |> login(user)
      {:error, changeset} ->
        conn |> render(Share.UserView, "new.html", changeset: changeset)
    end
  end

  defp login(conn, user) do
    conn
    |> Guardian.Plug.sign_in(user)
    |> redirect(to: "/")
  end
end
