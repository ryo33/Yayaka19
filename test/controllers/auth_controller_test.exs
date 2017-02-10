defmodule Share.AuthControllerTest do
  use Share.ConnCase

  alias Share.Repo
  alias Share.User

  setup do
    params = %{name: "a", display: "b", provider: "cool", provided_id: "d"}
    changeset = User.changeset(%User{}, params)
    user = Repo.insert!(changeset)
    password = "password"
    hashed_password = Comeonin.Bcrypt.hashpwsalt(password)
    changeset = Ecto.Changeset.change(user, password: hashed_password)
    {:ok, user} = Repo.update(changeset)
    {:ok, %{user: user, password: password}}
  end

  test "login with correct name and correct password", %{user: user, password: password} do
    conn = build_conn()
           |> post("/login/password", %{"user" => %{"name" => user.name, "password" => password}})
    assert user.name == Guardian.Plug.current_resource(conn).name
  end

  test "login with correct name and wrong password", %{user: user, password: password} do
    conn = build_conn()
           |> post("/login/password", %{"user" => %{"name" => user.name, "password" => "wrong_password"}})
    assert nil == Guardian.Plug.current_resource(conn)
  end

  test "login with wrong name and correct password", %{user: user, password: password} do
    conn = build_conn()
           |> post("/login/password", %{"user" => %{"name" => "wrong_name", "password" => password}})
    assert nil == Guardian.Plug.current_resource(conn)
  end

  test "login with wrong name and wrong password", %{user: user, password: password} do
    conn = build_conn()
           |> post("/login/password", %{"user" => %{"name" => "wrong_name", "password" => "wrong_password"}})
    assert nil == Guardian.Plug.current_resource(conn)
  end
end
