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
