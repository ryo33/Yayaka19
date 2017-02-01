defmodule Share.Repo.Migrations.AddBio do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :bio, :string, size: 2048
    end
  end
end
