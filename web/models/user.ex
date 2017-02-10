defmodule Share.User do
  use Share.Web, :model
  @derive {Poison.Encoder, only: [
    :name, :display, :bio, :id,
  ]}

  schema "users" do
    field :provider, :string
    field :provided_id, :string
    field :num, :integer
    field :name, :string
    field :display, :string
    field :bio, :string
    field :noticed, :naive_datetime
    field :secret, :string
    field :password, :string

    timestamps()
  end

  @required_fields [:name, :display]
  @fields [:bio] ++ @required_fields

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @fields)
    |> validate_required(@required_fields)
    |> validate_length(:name, min: 1, max: 32)
    |> validate_length(:display, min: 1, max: 32)
    |> validate_length(:bio, min: 0, max: 2048)
    |> unique_constraint(:name)
  end

  def password_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:password])
    |> validate_required([:password])
    |> validate_length(:password, min: 6, max: 255)
    |> update_change(:password, fn p -> Comeonin.Bcrypt.hashpwsalt(p) end)
  end
end
