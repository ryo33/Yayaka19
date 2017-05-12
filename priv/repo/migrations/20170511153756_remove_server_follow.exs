defmodule Share.Repo.Migrations.RemoveServerFollow do
  use Ecto.Migration

  def change do
    drop table(:server_follow)
  end
end
