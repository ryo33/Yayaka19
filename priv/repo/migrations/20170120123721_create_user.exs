defmodule Share.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :provider, :string
      add :provided_id, :string
      add :name, :string
      add :display, :string

      timestamps()
    end
    create unique_index(:users, [:name])
    create unique_index(:users, [:provided_id])

  end
end
