use Mix.Config

config :share, Share.Endpoint,
  secret_key_base: System.get_env("SECRET_KEY_BASE")

config :share, Share.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "share_prod",
  pool_size: 19,
  ssl: true,
  url: System.get_env("DATABASE_URL")

config :ueberauth, Ueberauth.Strategy.Github.OAuth,
  client_id: System.get_env("GITHUB_ID"),
  client_secret: System.get_env("GITHUB_SECRET")

config :guardian, Guardian,
  secret_key: System.get_env("GUARDIAN_SECRET")
