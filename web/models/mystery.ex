defmodule Share.Mystery do
  use Share.Web, :model
  @map_keys [
    :id, :user, :title, :inserted_at # ! :text
  ]
  @derive {Poison.Encoder, only: @map_keys}

  schema "mysteries" do
    field :title, :string
    field :text, :string
    belongs_to :user, Share.User

    timestamps()
  end

  def to_map(params) do
    Map.from_struct(params)
    |> Map.take(@map_keys)
  end

  def put_path(%__MODULE__{} = mystery), do: put_path(to_map(mystery))
  def put_path(mystery) do
    path = Share.Router.Helpers.page_path(Share.Endpoint, :mystery, mystery.id)
    Map.put(mystery, :path, path)
    |> Map.update(:user, nil, fn user -> Share.User.put_path(user) end)
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

  def user_mysteries(user) do
    from m in Share.Mystery,
      where: m.user_id == ^user.id
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
