defmodule Share.AuthController do
  use Share.Web, :controller
  plug Ueberauth

  alias Ueberauth.Strategy.Helpers
  alias Share.User

  plug Guardian.Plug.EnsureAuthenticated, %{handler: __MODULE__} when action in [
    :new, :switch
  ]

  @providers Application.get_env(:share, :providers)

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
      where: u.num == 0
    case Repo.one(query) do
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

  def new(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    changeset = User.changeset(%User{})
    conn
    |> put_session(:auth, %{provider: user.provider, id: user.provided_id})
    |> render(Share.UserView, "new.html", changeset: changeset)
  end

  def create(conn, %{"user" => params}) do
    %{provider: provider, id: id} = get_session(conn, :auth)
    %{"name" => name, "display" => display} = params
    changeset = User.changeset(%User{}, %{name: name, display: display})
                |> Ecto.Changeset.change(%{provider: provider, provided_id: id})
    query = from u in User,
      where: u.provider == ^provider and u.provided_id == ^id,
      order_by: [desc: u.num], limit: 1
    changeset = case Repo.one(query) do
      nil -> changeset
      user ->
        changeset
        |> Ecto.Changeset.change(%{num: user.num + 1})
    end
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

  def switch(conn, %{"name" => name}) do
    user = Guardian.Plug.current_resource(conn)
    query = from u in User,
      where: u.provider == ^user.provider,
      where: u.provided_id == ^user.provided_id,
      where: u.name == ^name
    case Repo.one(query) do
      nil ->
        conn
        |> redirect(to: "/t")
      user ->
        conn
        |> login(user)
    end
  end

  def password(conn, _params) do
    render(conn, "password.html", name: "", password: "")
  end

  def password_login(conn, %{"user" => user}) do
    %{"name" => name, "password" => password} = user
    if String.length(name) == 0 or String.length(password) == 0 do
      conn
      |> render("password.html", name: name, password: "", error: "Failed to sign in")
    else
      case Repo.one(User.local_user_by_name(name)) do
        nil ->
          Comeonin.Bcrypt.dummy_checkpw
          conn
          |> render("password.html", name: name, password: "", error: "Failed to sign in")
        user ->
          if is_nil(user.password) do
            Comeonin.Bcrypt.dummy_checkpw
            conn
            |> render("password.html", name: name, password: "", error: "Failed to sign in")
          else
            if Comeonin.Bcrypt.checkpw(password, user.password) do
              conn
              |> login(user)
            else
              conn
              |> render("password.html", name: name, password: "", error: "Failed to sign in")
            end
          end
      end
    end
  end

  defp login(conn, user) do
    conn
    |> Guardian.Plug.sign_in(user)
    |> redirect(to: "/t")
  end

  def dev_login(conn, %{"id" => id}) do
    :dev = Mix.env
    provider = "share"
    query = from u in User,
      where: u.provider == ^provider and u.provided_id == ^id,
      where: u.num == 0
    case Repo.one(query) do
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
end
