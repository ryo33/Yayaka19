defmodule Share.Repo.Migrations.AddPasswordToUser do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :password, :string, default: nil
    end
  end
end
