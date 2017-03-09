defmodule Share.MysteryTest do
  use Share.ModelCase

  alias Share.Mystery

  @valid_attrs %{text: "some content", title: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Mystery.changeset(%Mystery{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Mystery.changeset(%Mystery{}, @invalid_attrs)
    refute changeset.valid?
  end
end
