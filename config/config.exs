use Mix.Config

# General application configuration
config :share,
  ecto_repos: [Share.Repo]

config :share, Share.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "W1UEn6jzIfLiCen2i7CUTKUSjnpDgWufagT+D2O6mBOzQO/EytaoysBe+mcWxIiP",
  render_errors: [view: Share.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Share.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures the number of job workers
config :share, Share.Tasks,
  post_workers: 10,
  notice_workers: 10,
  http_workers: 10,
  remote_workers: 10

config :share, Share.Remote,
  pusher_workers: 10

# Configures the infomations
config :share,
  providers: [:github],
  title: "Yayaka20",
  description: "What's in your head?",
  url: "https://yayaka20.herokuapp.com",
  hashtag: "Yayaka20",
  # slogan: [header: "Watch Flip Flappers.",
  #          text: "Yayaka loves Cocona but ..."],
  # trusted_hosts_for_images: [],
  admin: [name: "Ryo33",
          url: "https://twitter.com/ryo33music"],
  source: [url: "https://github.com/ryo33/Yayaka19",
           title: "https://github.com/ryo33/Yayaka19"],
  api: [url: "https://gist.github.com/ryo33/145e5ef24bad6f11abbb902edc6979d6",
        title: "https://gist.github.com/ryo33/145e5ef24bad6f11abbb902edc6979d6"]

# Authentication
config :ueberauth, Ueberauth,
  providers: [
    github: {Ueberauth.Strategy.Github, [default_scope: ""]},
  ]

config :guardian, Guardian,
  allowed_algos: ["HS512"], # optional
  verify_module: Guardian.JWT,  # optional
  issuer: "Yayaka19",
  ttl: { 30, :days },
  verify_issuer: true, # optional
  secret_key: System.get_env("GUARDIAN_SECRET_KEY") || "abcdef",
  serializer: Share.UserSerializer

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
