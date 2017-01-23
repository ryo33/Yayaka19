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

config :share,
  title: "Share",
  description: "We enjoy reading stray posts.",
  url: "https://sha.herokuapp.com",
  source: [url: "https://github.com/ryo33/share",
           title: "https://github.com/ryo33/share"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Authentication
config :ueberauth, Ueberauth,
  providers: [
    google: {Ueberauth.Strategy.Google, [default_scope: "email"]},
    facebook: {Ueberauth.Strategy.Facebook, [default_scope: ""]},
    github: {Ueberauth.Strategy.Github, [default_scope: ""]}
  ]

config :guardian, Guardian,
  allowed_algos: ["HS512"], # optional
  verify_module: Guardian.JWT,  # optional
  issuer: "Share",
  ttl: { 30, :days },
  verify_issuer: true, # optional
  secret_key: System.get_env("GUARDIAN_SECRET_KEY") || "abcdef",
  serializer: Share.UserSerializer

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
