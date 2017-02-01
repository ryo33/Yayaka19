import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger'
import createHistory from 'history/createBrowserHistory'

import { signedIn, userID } from './global.js'
import App from './components/App.js'
import { pages, pagesMiddleware } from './pages.js'
import reducer from './reducers/index.js'
import { pageSelector } from './selectors.js'
import middleware from './middlewares.js'
import {
  addFavs, updateTimeline, setUser,
  setFollowing, updateNoticed, updateNotices,
  showError, hideError, doPing
} from './actions.js'
import { joinChannel, joinUserChannel } from './socket.js'
import { watchUserChannel } from './userChannel.js'

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
const userChannelCallback = ({ user, noticed, following, notices, timeline }) => {
  const { favs, posts } = timeline
  store.dispatch(setUser(user))
  store.dispatch(addFavs(favs))
  store.dispatch(updateTimeline(posts))
  store.dispatch(updateNoticed(noticed))
  store.dispatch(updateNotices(notices))
  store.dispatch(setFollowing(following))
}
if (signedIn) {
  joinUserChannel(userChannelCallback)
  watchUserChannel(store)
}

let pingTimer = null
const respCallback = () => {
  store.dispatch(hideError())
  if (pingTimer) {
    clearInterval(pingTimer)
  }
  pingTimer = setInterval(() => {
    store.dispatch(doPing())
  }, 30000)
}
const errorCallback = () => {
  store.dispatch(showError('Failed to connect to the server.'))
}
joinChannel(respCallback, errorCallback)

// Apply the current path
pages.handleNavigation(store, history.location.pathname)

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
