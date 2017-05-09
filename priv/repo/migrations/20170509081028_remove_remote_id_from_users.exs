defmodule Share.Repo.Migrations.RemoveRemoteIdFromUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      remove :remote_id
    end
  end
end
