defmodule Share.ServerFollowTest do
  use Share.ModelCase

  alias Share.ServerFollow

  @valid_attrs %{user_id: 0, server_id: 0}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = ServerFollow.changeset(%ServerFollow{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = ServerFollow.changeset(%ServerFollow{}, @invalid_attrs)
    refute changeset.valid?
  end
end
