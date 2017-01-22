import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger'
import createHistory from 'history/createBrowserHistory'

import App from './components/App.js'
import { pages, pagesMiddleware } from './pages.js'
import reducer from './reducers/index.js'
import { pageSelector } from './selectors.js'
import middleware from './middlewares.js'
import { setUser, setFollowing } from './actions.js'
import { joinChannel } from './socket.js'

// Create the pagesMiddleware
const history = createHistory({})
const getCurrentPath = () => history.location.pathname
const pushPath = (path) => history.push(path)
const reduxPagesMiddleware = pages
  .middleware(pageSelector, getCurrentPath, pushPath)

// Create the store
const middlewares = [middleware]
if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger()
  middlewares.push(logger)
}
const store = createStore(
  reducer,
  applyMiddleware(reduxPagesMiddleware, pagesMiddleware, ...middlewares),
)

// Socket
const respCallback = ({ user, following }) => {
  store.dispatch(setUser(user))
  store.dispatch(setFollowing(following))
  // Apply the current path
  pages.handleNavigation(store, history.location.pathname)
}
const errorCallback = () => window.location.reload(true)
joinChannel(respCallback, errorCallback)

// Listen for changes
history.listen((location, action) => {
  pages.handleNavigation(store, location.pathname)
})

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
