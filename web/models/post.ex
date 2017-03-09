defmodule Share.Post do
  use Share.Web, :model

  defimpl Poison.Encoder, for: Share.Post do
    def encode(params, options) do
      params = case params.post do
        %Ecto.Association.NotLoaded{} -> Map.delete(params, :post)
        _ -> params
      end
      params = case params.mystery do
        %Ecto.Association.NotLoaded{} -> Map.delete(params, :mystery)
        _ -> params
      end
      Map.from_struct(params)
      |> Enum.filter(fn {key, _} -> Enum.member?([
        :id, :text, :user_display, :user, :inserted_at,
        :post, :post_id, :post_addresses, :mystery, :mystery_id
      ], key) end)
      |> Enum.into(%{})
      |> Poison.encode!(options)
    end
  end

  schema "posts" do
    field :text, :string
    field :user_display, :string
    belongs_to :user, Share.User
    belongs_to :post, Share.Post
    belongs_to :mystery, Share.Mystery

    has_many :post_addresses, Share.PostAddress

    timestamps()
  end

  @required_fields ~w(user_id)a
  @optional_fields ~w(text post_id user_display mystery_id)a
  @fields @required_fields ++ @optional_fields

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @fields)
    |> validate_required(@required_fields)
    |> validate_length(:text, min: 0)
  end

  def opened_mystery_posts(user) do
    from p in Share.Post,
      join: m in Share.Mystery, on: p.mystery_id == m.id,
      where: p.user_id == ^user.id and m.user_id != ^user.id,
      order_by: [desc: :id]
  end

  def from_mysteries(query, user) do
    from p in Share.Post,
      right_join: m in ^query, on: p.mystery_id == m.id,
      where: p.user_id == ^user.id,
      preload: ^Share.Post.preload_params,
      order_by: [desc: :id]
  end

  @preload [
    :user, mystery: [:user], post_addresses: :user, post: [
      :user, mystery: [:user], post_addresses: :user]]
  @deep_preload [
    :user, mystery: [:user], post_addresses: :user, post: [
      :user, mystery: [:user], post_addresses: :user, post: [
        :user, mystery: [:user], post_addresses: :user, post: [
          :user, mystery: [:user], post_addresses: :user, post: [
            :user, :post, mystery: [:user], post_addresses: :user]]]]]

  def preload_params, do: @preload
  def deep_preload_params, do: @deep_preload

  def preload(%Share.Post{} = post) do
    Share.Repo.preload(post, @preload)
  end

  def preload(query) do
    query
    |> preload(^@preload)
  end

  def deep_preload(%Share.Post{} = post) do
    Share.Repo.preload(post, @deep_preload)
  end

  def deep_preload(query) do
    query
    |> preload(^@deep_preload)
  end
end
