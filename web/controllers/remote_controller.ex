defmodule Share.RemoteController do
  use Share.Web, :controller

  def token(conn, %{"host" => host, "token" => token}) do
    case Phoenix.Token.verify(Share.Endpoint, "remote", token) do
      {:ok, ^host} ->
        json conn, true
      _ ->
        json conn, false
    end
  end
end
