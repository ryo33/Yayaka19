defmodule Share.Repo.Migrations.CreateServer do
  use Ecto.Migration

  def change do
    create table(:servers) do
      add :host, :string, size: 256

      timestamps()
    end

  end
end
