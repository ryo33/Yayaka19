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

  scope "/", Share do
    pipe_through [:browser, :browser_auth]

    get "/", PageController, :index
    get "/users/:id", UserController, :show

    get "/login", AuthController, :login_page
    post "/auth/login", AuthController, :login
    get "/logout", AuthController, :delete

    get "/auth/:provider", AuthController, :request
    get "/auth/:provider/callback", AuthController, :callback
    post "/auth/create", AuthController, :create
  end
end
