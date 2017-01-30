defmodule Share.Repo.Migrations.AddUserSecret do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :secret, :string
    end
  end
end
