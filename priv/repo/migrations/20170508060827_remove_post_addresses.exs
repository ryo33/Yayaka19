defmodule Share.Repo.Migrations.RemovePostAddresses do
  use Ecto.Migration

  def change do
    alter table(:posts) do
      add :address_user_id, references(:users, on_delete: :nothing)
    end
    execute """
    UPDATE posts AS p
    SET address_user_id = pa.user_id
    FROM post_addresses pa
    WHERE p.id = pa.post_id
    """
    drop table(:post_addresses)
  end
end
