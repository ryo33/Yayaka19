defmodule Share.Router do
  use Share.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    if Mix.env == :prod do
      plug Share.Plugs.DomainRedirect
    end
  end

  pipeline :browser_auth do
    plug Guardian.Plug.VerifySession
    plug Guardian.Plug.LoadResource
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :api_auth do
    plug Guardian.Plug.VerifyHeader, realm: "Bearer"
    plug Guardian.Plug.LoadResource
  end

  scope "/yayaka", Share do
    pipe_through [:api]

    get "/token", RemoteController, :token
  end

  scope "/api", Share do
    pipe_through [:api, :api_auth]
    put "/users/:user", APIController, :login
    post "/users/:user/post", APIController, :post
    delete "/users/:user", APIController, :logout
  end

  scope "/", Share do
    pipe_through [:browser, :browser_auth]

    get "/terms", PageController, :terms
    get "/privacy", PageController, :privacy

    get "/profile/api", UserController, :api
    get "/profile/api/update", UserController, :update_api

    get "/login", PageController, :index
    get "/logout", AuthController, :delete

    get "/login/password", AuthController, :password
    post "/login/password", AuthController, :password_login
    get "/login/password/update", UserController, :password
    put "/login/password/update", UserController, :update_password

    only_dev do
      get "/login/dev/:id", AuthController, :dev_login
    end

    get "/new", AuthController, :new
    get "/switch/:name", AuthController, :switch
    get "/auth/:provider", AuthController, :request
    get "/auth/:provider/callback", AuthController, :callback
    post "/auth/create", AuthController, :create

    get "/posts/:id", PageController, :post
    get "/users/:name", PageController, :user
    get "/*page", PageController, :index
  end
end
