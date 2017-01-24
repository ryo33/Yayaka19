defmodule Share.Repo.Migrations.CreatePostAddress do
  use Ecto.Migration

  def change do
    create table(:post_addresses) do
      add :post_id, references(:posts, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:post_addresses, [:post_id])
    create index(:post_addresses, [:user_id])

  end
end
