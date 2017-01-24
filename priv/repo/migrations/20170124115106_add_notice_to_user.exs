defmodule Share.Repo.Migrations.AddNoticeToUser do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :fav_id, references(:favs, on_delete: :nothing), default: nil
      add :follow_id, references(:follows, on_delete: :nothing), default: nil
      add :post_address_id, references(:post_addresses, on_delete: :nothing), default: nil
    end
  end
end
