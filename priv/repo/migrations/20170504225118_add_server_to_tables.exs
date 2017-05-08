defmodule Share.Repo.Migrations.AddServer do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :server_id, references(:servers, on_delete: :nothing)
      add :remote_id, :string
      add :remote_path, :string
    end
    create index(:users, [:server_id])
    drop unique_index(:users, [:name])
    create unique_index(:users, [:remote_id, :server_id])

    alter table(:posts) do
      add :server_id, references(:servers, on_delete: :nothing)
      add :remote_id, :string
      add :remote_path, :string
    end
    create index(:posts, [:server_id])
  end
end
