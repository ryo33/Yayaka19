# Share

sha.herokuapp.com is a social networking service where users post texts.

As the first big feature, posts displayed on the timeline are randomly chosen.
This feature make it difficult to completely follow posts on the timeline.
If you want someone to certainly read a post, you should reply.

Second, all posts don't have unique URLs.
It is impossible to bookmark and share posts.

You need to login to post, follow users, use personal timeline, and favorite posts.

## Development

A note for contributors.

### Requirements

* Node.js
* Elixir/Erlang
* PostgreSQL

#### For macOS

```
$ brew install elixir postgresql
$ brew services start postgresql
```

### Install dependencies

```
$ mix deps.get
$ npm i
```

### Prepare database

Prepare role and database for Share development.
I assume you use a role `share_dev` with password `share_dev` and a database `share_dev`.

```
$ psql -U <username> -d postgres

postgres=# CREATE ROLE share_dev WITH LOGIN SUPERUSER PASSWORD 'share_dev';
CREATE ROLE
postgres=# CREATE DATABASE share_dev;
CREATE DATABASE
postgres=# \q
```

Change `dev.exs` in `config` directory.

```
# Configure your database
config :share, Share.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "share_dev",
  password: "share_dev",
  database: "share_dev",
  hostname: "localhost",
  pool_size: 10
```

Do migration.

```
$ mix ecto.migrate
```

### Start dev server

```
$ mix phoenix.start
```
