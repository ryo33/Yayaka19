defmodule Share.Repo.Migrations.CreateServerFollow do
  use Ecto.Migration

  def change do
    create table(:server_follow) do
      add :user_id, references(:users, on_delete: :nothing)
      add :server_id, references(:servers, on_delete: :nothing)

      timestamps()
    end
    create index(:server_follow, [:user_id])
    create index(:server_follow, [:server_id])

  end
end
