defmodule Share.Plugs.DomainRedirectTest do
  use Share.ConnCase

  @host Application.get_env(:share, Share.Endpoint)[:url][:host]

  test "host" do
    assert @host != nil
  end

  test "redirect if domain is wrong" do
    conn = %{build_conn() | host: "wrong.host.example.com"}
           |> Share.Plugs.DomainRedirect.call(%{})

    assert conn.status == 302
    assert redirected_to(conn) =~ @host
  end

  test "don't redirect if domain is correct" do
    conn = %{build_conn() | host: @host}
           |> Share.Plugs.DomainRedirect.call(%{})

    assert conn.status != 302
  end
end
