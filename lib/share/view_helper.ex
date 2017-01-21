defmodule Share.ViewHelper do
  def logged_in?(conn) do
    not (Guardian.Plug.current_resource(conn) |> is_nil())
  end

  def current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
