defmodule Share.Remote.Message do
  def create(host, action, payload \\ %{}) do
    %{
      host: host,
      action: action,
      payload: payload
    }
  end

  def create_reply(to, payload) do
    create(to["from"], :reply, payload)
    |> Map.put(:reply_to, to["id"])
    |> noreply()
  end

  def noreply(message, value \\ true) do
    message
    |> Map.put(:noreply, value)
  end
end
