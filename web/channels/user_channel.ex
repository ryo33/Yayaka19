defmodule Share.UserChannel do
  use Share.Web, :channel
  alias Share.User
  alias Share.Repo

  require Logger

  def join("user", _params, socket) do
    {:ok, socket}
  end
end
