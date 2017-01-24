defmodule Share.Post do
  use Share.Web, :model
  @derive {Poison.Encoder, only: [
    :id, :text, :user
  ]}

  schema "posts" do
    field :text, :string
    field :views, :integer, default: 0
    belongs_to :user, Share.User
    belongs_to :post, Share.Post

    timestamps()
  end

  @required_fields ~w(text user_id)a
  @optional_fields ~w(post_id)a
  @fields @required_fields ++ @optional_fields

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @fields)
    |> validate_required(@required_fields)
    |> validate_length(:text, min: 1)
  end

  def random(query) do
    query
    |> order_by(fragment("RANDOM() * (LN(views + 1) + SIN(views) + 1)"))
  end
end
