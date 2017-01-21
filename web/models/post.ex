defmodule Share.Post do
  use Share.Web, :model

  schema "posts" do
    field :text, :string
    belongs_to :user, Share.User
    belongs_to :post, Share.Post

    timestamps()
  end

  @required_fields ~w(text user_id)
  @optional_fields ~w(post_id)
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
end
