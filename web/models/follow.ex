defmodule Share.Follow do
  use Share.Web, :model

  schema "follows" do
    belongs_to :user, Share.User
    belongs_to :target_user, Share.TargetUser

    timestamps()
  end

  @fields [:user_id, :target_user_id]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @fields)
    |> validate_required(@fields)
  end
end
