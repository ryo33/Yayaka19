defmodule Share.PostAddressTest do
  use Share.ModelCase

  alias Share.PostAddress

  @valid_attrs %{}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = PostAddress.changeset(%PostAddress{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = PostAddress.changeset(%PostAddress{}, @invalid_attrs)
    refute changeset.valid?
  end
end
