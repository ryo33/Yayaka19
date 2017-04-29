defmodule Share.ServerTest do
  use Share.ModelCase

  alias Share.Server

  @valid_attrs %{host: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Server.changeset(%Server{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Server.changeset(%Server{}, @invalid_attrs)
    refute changeset.valid?
  end
end
