defmodule Share.Repo.Migrations.CreateMystery do
  use Ecto.Migration

  def change do
    create table(:mysteries) do
      add :title, :string
      add :text, :string, size: 4096
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:mysteries, [:user_id])

  end
end
