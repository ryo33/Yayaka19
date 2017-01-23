defmodule Share.Repo.Migrations.ChangePostLength do
  use Ecto.Migration

  def change do
    alter table(:posts) do
      modify :text, :string, size: 4096
    end
  end
end
