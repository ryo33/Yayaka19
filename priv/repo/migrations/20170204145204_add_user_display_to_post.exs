defmodule Share.Repo.Migrations.AddUserDisplayToPost do
  use Ecto.Migration

  def change do
    alter table(:posts) do
      add :user_display, :string
    end
  end
end
