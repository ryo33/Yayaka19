# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :share,
  ecto_repos: [Share.Repo]

# Configures the endpoint
config :share, Share.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "W1UEn6jzIfLiCen2i7CUTKUSjnpDgWufagT+D2O6mBOzQO/EytaoysBe+mcWxIiP",
  render_errors: [view: Share.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Share.PubSub,
           adapter: Phoenix.PubSub.PG2]

config :share, Share.Tasks,
  post_workers: 10,
  online_post_workers: 10,
  notice_workers: 10

config :share,
  title: "Yayaka19",
  description: "What's in your head?",
  url: "https://yayaka.net",
  hashtag: "Yayaka19",
  admin: [name: "Ryo33",
           url: "https://twitter.com/ryo33music"],
  source: [url: "https://github.com/ryo33/Yayaka19",
           title: "https://github.com/ryo33/Yayaka19"],
  api: [url: "https://gist.github.com/ryo33/145e5ef24bad6f11abbb902edc6979d6",
        title: "https://gist.github.com/ryo33/145e5ef24bad6f11abbb902edc6979d6"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Authentication
config :ueberauth, Ueberauth,
  providers: [
    google: {Ueberauth.Strategy.Google, [default_scope: "email"]},
    facebook: {Ueberauth.Strategy.Facebook, [default_scope: ""]},
    github: {Ueberauth.Strategy.Github, [default_scope: ""]},
    twitter: {Ueberauth.Strategy.Twitter, []}
  ]

config :guardian, Guardian,
  allowed_algos: ["HS512"], # optional
  verify_module: Guardian.JWT,  # optional
  issuer: "Yayaka19",
  ttl: { 30, :days },
  verify_issuer: true, # optional
  secret_key: System.get_env("GUARDIAN_SECRET_KEY") || "abcdef",
  serializer: Share.UserSerializer

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
