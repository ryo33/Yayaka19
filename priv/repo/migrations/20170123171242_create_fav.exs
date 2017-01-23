defmodule Share.Repo.Migrations.CreateFav do
  use Ecto.Migration

  def change do
    create table(:favs) do
      add :user_id, references(:users, on_delete: :nothing)
      add :post_id, references(:posts, on_delete: :nothing)

      timestamps()
    end
    create index(:favs, [:user_id])
    create index(:favs, [:post_id])

  end
end
