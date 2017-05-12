defmodule Share.Repo.Migrations.AddServerToMystery do
  use Ecto.Migration

  def change do
    alter table(:mysteries) do
      add :server_id, references(:servers, on_delete: :nothing)
      add :remote_id, :string
      add :remote_path, :string
    end
    create unique_index(:mysteries, [:remote_id, :server_id])
  end
end
