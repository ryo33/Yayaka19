defmodule Share.PostAddress do
  use Share.Web, :model
  @map_keys [
    :id, :user
  ]
  @derive {Poison.Encoder, only: @map_keys}

  schema "post_addresses" do
    belongs_to :post, Share.Post
    belongs_to :user, Share.User

    timestamps()
  end

  def to_map(params) do
    Map.from_struct(params)
    |> Map.take(@map_keys)
  end

  def put_path(%__MODULE__{} = address), do: put_path(to_map(address))
  def put_path(address) do
    Map.update!(address, :user, fn user ->
      Share.User.put_path(user)
    end)
  end

  @fields [:post_id, :user_id]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @fields)
    |> validate_required(@fields)
  end
end
