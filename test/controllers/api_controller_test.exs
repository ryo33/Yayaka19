defmodule Share.APIControllerTest do
  use Share.ConnCase

  alias Share.Repo
  alias Share.User

  setup do
    params = %{name: "a", display: "b", provider: "cool", provided_id: "d"}
    changeset = User.changeset(%User{}, params)
    user = Repo.insert!(changeset)
    secret = SecureRandom.urlsafe_base64(32)
    changeset = Ecto.Changeset.change(user, secret: secret)
    {:ok, user} = Repo.update(changeset)
    {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user)
    {:ok, %{user: user, jwt: jwt}}
  end

  test "login", %{user: user, jwt: jwt} do
    conn = build_conn()
           |> put("/api/users/#{user.name}", %{"secret" => user.secret})
    assert conn.status == 201
    %{"token" => token} = Poison.decode!(conn.resp_body)

    conn = build_conn()
           |> put_req_header("authorization", "Bearer #{token}")
           |> post("/api/users/#{user.id}/post", %{"text" => "a"})
    assert conn.status == 200
    assert conn.resp_body =~ "post"
  end

  test "post", %{user: user, jwt: jwt} do
    conn = build_conn()
           |> put_req_header("authorization", "Bearer #{jwt}")
           |> post("/api/users/#{user.id}/post", %{"text" => "a"})
    assert conn.status == 200
    assert conn.resp_body =~ "post"
  end
end
