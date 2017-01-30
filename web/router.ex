defmodule Share.Router do
  use Share.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
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

  scope "/", Share do
    pipe_through [:browser, :browser_auth]

    get "/profile/api", UserController, :api
    get "/profile/api/update", UserController, :update_api
    get "/profile", UserController, :edit
    put "/profile", UserController, :update

    only_dev do
      get "/login/:id", AuthController, :dev_login
    end

    get "/login", PageController, :index
    post "/auth/login", AuthController, :login
    get "/logout", AuthController, :delete

    get "/auth/:provider", AuthController, :request
    get "/auth/:provider/callback", AuthController, :callback
    post "/auth/create", AuthController, :create

    get "/*page", PageController, :index
  end

  scope "/api", Share do
    pipe_through [:api, :api_auth]
    put "/users/:user", APIController, :login
    post "/users/:user/post", APIController, :post
    delete "/users/:user", APIController, :logout
  end
end
