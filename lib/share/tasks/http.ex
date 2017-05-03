defmodule Share.Tasks.HTTP do
  def get(url, params \\ %{}) do
    {:handle_get, [url, params]}
    |> Honeydew.async(:http, reply: true)
    |> Honeydew.yield
  end

  def handle_get(url, params) do
    HTTPoison.get(url, [], params: params)
  end
end
