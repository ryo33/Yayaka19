defmodule Share.User do
  use Share.Web, :model
  @derive {Poison.Encoder, only: [
    :name, :display, :id,
  ]}

  schema "users" do
    field :provider, :string
    field :provided_id, :string
    field :name, :string
    field :display, :string
    belongs_to :fav, Share.Fav
    belongs_to :follow, Share.Follow
    belongs_to :post_address, Share.PostAddress

    timestamps()
  end

  @fields [:name, :display, :provider, :provided_id]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @fields)
    |> validate_required(@fields)
    |> validate_length(:name, min: 1, max: 32)
    |> validate_length(:display, min: 1, max: 32)
    |> validate_length(:provider, min: 3)
    |> validate_length(:provided_id, min: 1)
    |> unique_constraint(:name)
    |> unique_constraint(:provided_id)
  end
end
