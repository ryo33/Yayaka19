defmodule Share.FavTest do
  use Share.ModelCase

  alias Share.Fav

  @valid_attrs %{}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Fav.changeset(%Fav{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Fav.changeset(%Fav{}, @invalid_attrs)
    refute changeset.valid?
  end
end
