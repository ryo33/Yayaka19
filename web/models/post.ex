defmodule Share.Post do
  use Share.Web, :model

  defimpl Poison.Encoder, for: Share.Post do
    def encode(params, options) do
      case params.post do
        %Ecto.Association.NotLoaded{} -> Map.delete(params, :post)
        _ -> params
      end
      |> Map.from_struct
      |> Enum.filter(fn {key, _} -> Enum.member?([
        :id, :text, :user, :post, :post_addresses, :inserted_at
      ], key) end)
      |> Enum.into(%{})
      |> Poison.encode!(options)
    end
  end

  schema "posts" do
    field :text, :string
    field :views, :integer, default: 0
    belongs_to :user, Share.User
    belongs_to :post, Share.Post

    has_many :post_addresses, Share.PostAddress

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

  @preload [:user, post_addresses: :user, post: [:user, post_addresses: :user]]

  def preload_params, do: @preload

  def preload(%Share.Post{} = post) do
    Share.Repo.preload(post, @preload)
  end

  def preload(query) do
    query
    |> preload(^@preload)
  end
end
