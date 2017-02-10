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

config :ueberauth, Ueberauth.Strategy.Google.OAuth,
  client_id: System.get_env("GOOGLE_ID"),
  client_secret: System.get_env("GOOGLE_SECRET"),
  redirect_uri: "https://yayaka.net/auth/google/callback"

config :ueberauth, Ueberauth.Strategy.Facebook.OAuth,
  client_id: System.get_env("FACEBOOK_ID"),
  client_secret: System.get_env("FACEBOOK_SECRET")

config :ueberauth, Ueberauth.Strategy.Github.OAuth,
  client_id: System.get_env("GITHUB_ID"),
  client_secret: System.get_env("GITHUB_SECRET")

config :ueberauth, Ueberauth.Strategy.Twitter.OAuth,
  consumer_key: System.get_env("TWITTER_ID"),
  consumer_secret: System.get_env("TWITTER_SECRET")

config :guardian, Guardian,
  secret_key: System.get_env("GUARDIAN_SECRET")
