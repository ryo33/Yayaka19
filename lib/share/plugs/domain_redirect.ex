defmodule Share.Plugs.DomainRedirect do
  import Plug.Conn

  @host Application.get_env(:share, Share.Endpoint)[:url][:host]

  def init(options) do
    options
  end

  def call(conn, _options) do
    if validate_domain(conn.host) do
      conn
    else
      conn
        |> Phoenix.Controller.redirect(external: get_valid_url(conn))
        |> halt
    end
  end

  defp get_valid_url(conn) do
    scheme = case conn.scheme do
      :http -> "http"
      :https -> "https"
    end
    host = @host
    path = conn.request_path
    "#{scheme}://#{host}#{path}"
  end

  defp validate_domain(host) do
    host == @host
  end
end
