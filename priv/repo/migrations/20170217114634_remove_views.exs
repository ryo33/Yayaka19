defmodule Share.Repo.Migrations.RemoveViews do
  use Ecto.Migration

  def change do
    alter table(:posts) do
      remove :views
    end
  end
end
