defmodule Share.PostAddress do
  use Share.Web, :model
  @derive {Poison.Encoder, only: [
    :id, :user
  ]}

  schema "post_addresses" do
    belongs_to :post, Share.Post
    belongs_to :user, Share.User

    timestamps()
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
