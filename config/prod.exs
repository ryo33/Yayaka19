use Mix.Config

config :share, Share.Endpoint,
  http: [port: {:system, "PORT"}],
  url: [scheme: "https", host: "sha.herokuapp.com", port: 80],
  force_ssl: [rewrite_on: [:x_forwarded_proto]],
  cache_static_manifest: "priv/static/manifest.json"

config :logger, level: :info

import_config "prod.secret.exs"
