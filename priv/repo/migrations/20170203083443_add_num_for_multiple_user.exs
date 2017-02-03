defmodule Share.Repo.Migrations.AddNumForMultipleUser do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :num, :integer, default: 0
    end
    drop unique_index(:users, [:provided_id])
    create unique_index(:users, [:provider, :provided_id, :num])
  end
end
