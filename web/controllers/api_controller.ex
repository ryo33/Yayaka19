defmodule Share.APIController do
  use Share.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, %{handler: __MODULE__} when action in [
    :post, :logout]

  def login(conn, params) do
    user = case params do
      %{"user" => user_id, "secret" => secret} ->
        if String.length(secret) >= 1 do
          Repo.get_by(Share.User, name: user_id, secret: secret)
        else
          nil
        end
      _ ->
        nil
    end

    if not is_nil(user) do
      new_conn = Guardian.Plug.api_sign_in(conn, user)
      jwt = Guardian.Plug.current_token(new_conn)
      {:ok, claims} = Guardian.Plug.claims(new_conn)
      exp = Map.get(claims, "exp")

      user = %{
        id: user.name,
        name: user.display
      }
      new_conn
      |> put_resp_header("authorization", "Bearer #{jwt}")
      |> put_resp_header("x-expires", Poison.encode!(exp))
      |> send_resp(201, Poison.encode!(%{user: user, token: jwt, exp: exp}))
    else
      conn
      |> send_resp(401, Poison.encode!(%{message: "Could not login"}))
    end
  end

  def post(conn, params) do
    user = Guardian.Plug.current_resource(conn)
    case Share.APIHandler.post(user, params) do
      {:ok, status, body} ->
        send_resp(conn, status, body |> Poison.encode!())
      {:error, status, body} ->
        send_resp(conn, status, body |> Poison.encode!())
    end
  end

  def logout(conn, _params) do
    jwt = Guardian.Plug.current_token(conn)
    claims = Guardian.Plug.claims(conn)
    Guardian.revoke!(jwt, claims)
    send_resp(conn, 200, Poison.encode!(%{}))
  end

  def unauthenticated(conn, _params) do
    conn
    |> put_status(401)
    |> render "error.json", message: "Authentication required"
  end
end
