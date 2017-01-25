defmodule Share.Repo.Migrations.ChangeUserNoticeType do
  use Ecto.Migration

  def change do
    execute "ALTER TABLE users DROP CONSTRAINT users_fav_id_fkey"
    execute "ALTER TABLE users DROP CONSTRAINT users_follow_id_fkey"
    execute "ALTER TABLE users DROP CONSTRAINT users_post_address_id_fkey"
    alter table(:users) do
      modify :fav_id, :integer
      modify :follow_id, :integer
      modify :post_address_id, :integer
    end
  end
end
