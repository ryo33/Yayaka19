use Mix.Config

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with brunch.io to recompile .js and .css sources.
watchers = if System.get_env("WEBPACK") == "false" do
  []
else
  [node: ["node_modules/webpack/bin/webpack.js",
   "--watch-stdin", cd: Path.expand("../", __DIR__)]]
end
config :share, Share.Endpoint,
  http: [port: System.get_env("PORT") || 4000],
  url: [host: "localhost", port: System.get_env("PORT") || 4000],
  debug_errors: true,
  code_reloader: true,
  check_origin: false,
  watchers: watchers


# Watch static and templates for browser reloading.
config :share, Share.Endpoint,
  live_reload: [
    patterns: [
      ~r{priv/static/.*(js|css|png|jpeg|jpg|gif|svg)$},
      ~r{priv/gettext/.*(po)$},
      ~r{web/views/.*(ex)$},
      ~r{web/templates/.*(eex)$},
      ~r{web/channels/.*(ex)$}
    ]
  ]

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Configure your database
config :share, Share.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "share_dev",
  hostname: "localhost",
  pool_size: 10
