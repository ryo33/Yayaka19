defmodule Share.Repo.Migrations.ModifyNoticesUser do
  use Ecto.Migration

  def change do
    alter table(:users) do
      remove :fav_id
      remove :follow_id
      remove :post_address_id
      add :noticed, :naive_datetime
    end
  end
end
