# Share

[Yayaka.net](https://yayaka.net) is a progressive experimental social networking service where users post texts.
You need to login to post, follow users, use timeline, and more.

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md).

## Development

A note for contributors.

### Requirements

* Node.js
* Elixir/Erlang
* PostgreSQL

### Install dependencies

```
$ mix deps.get
$ npm i
```

### Setup

Reference: [Installing Elixir & the Phoenix framework with Homebrew on OS X](https://gist.github.com/likethesky/abb00e5aedc38ee9f711).

```
$ createuser -d postgres
$ mix ecto.setup
```

### Start dev server

```
$ mix phoenix.server
```

Open `http://localhost:4000` with your browser.


### DB migration

Sometimes after you import changes from upstream, you get many errors related the database.
Don't be panic, you just run following command before start the development server.

```
$ mix ecto.migrate
```
