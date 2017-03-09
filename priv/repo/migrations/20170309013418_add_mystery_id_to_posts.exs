defmodule Share.Repo.Migrations.AddMysteryIdToPosts do
  use Ecto.Migration

  def change do
    alter table(:posts) do
      add :mystery_id, references(:mysteries, on_delete: :nothing)
    end
    create index(:posts, [:mystery_id])
  end
end
