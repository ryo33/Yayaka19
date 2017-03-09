defmodule Share.Mystery do
  use Share.Web, :model
  @derive {Poison.Encoder, only: [
    :id, :user, :title, :inserted_at # ! :text
  ]}

  schema "mysteries" do
    field :title, :string
    field :text, :string
    belongs_to :user, Share.User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :text, :user_id])
    |> validate_required([:title, :text])
    |> validate_length(:title, min: 1, max: 128)
    |> validate_length(:text, min: 1, max: 4096)
  end

  @preload [:user]

  def preload(%Share.Mystery{} = mystery) do
    Share.Repo.preload(mystery, @preload)
  end

  def preload(query) do
    query
    |> preload(^@preload)
  end
end
