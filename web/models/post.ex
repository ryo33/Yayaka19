defmodule Share.Post do
  use Share.Web, :model

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

  def encode(post, socket) do
    posts = socket.assigns.posts
    client_posts = socket.assigns.client_posts
    {socket, id} = case Map.get(posts, post.id) do
      nil ->
        id = Map.size(client_posts) + 1
        posts = Map.put(posts, post.id, id)
        client_posts = Map.put(client_posts, id, post.id)
        socket = Phoenix.Socket.assign(socket, :posts, posts)
        socket = Phoenix.Socket.assign(socket, :client_posts, client_posts)
        {socket, id}
      id ->
        {socket, id}
    end
    post = %{
      id: id,
      text: post.text,
      user: post.user
    }
    {post, socket}
  end

  def random(query) do
    query
    |> order_by(fragment("RANDOM() * (LN(views + 1) + SIN(views) + 1)"))
  end
end
