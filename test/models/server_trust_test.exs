defmodule Share.ServerTrustTest do
  use Share.ModelCase

  alias Share.ServerTrust

  @valid_attrs %{user_id: 0, server_id: 0}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = ServerTrust.changeset(%ServerTrust{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = ServerTrust.changeset(%ServerTrust{}, @invalid_attrs)
    refute changeset.valid?
  end
end
