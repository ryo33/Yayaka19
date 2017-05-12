defmodule Share.Repo.Migrations.CreateServerTrust do
  use Ecto.Migration

  def change do
    create table(:server_trust) do
      add :user_id, references(:users, on_delete: :nothing)
      add :server_id, references(:servers, on_delete: :nothing)

      timestamps()
    end
    create index(:server_trust, [:user_id])
    create index(:server_trust, [:server_id])

  end
end
