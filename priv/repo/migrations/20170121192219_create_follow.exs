defmodule Share.Repo.Migrations.CreateFollow do
  use Ecto.Migration

  def change do
    create table(:follows) do
      add :user_id, references(:users, on_delete: :nothing)
      add :target_user_id, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:follows, [:user_id])
    create index(:follows, [:target_user_id])

  end
end
