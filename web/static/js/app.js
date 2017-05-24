import React from 'react'
import { render } from 'react-dom'
import {
  createStore, applyMiddleware, combineReducers, compose
} from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger'
import { createAsyncHook } from 'redux-middlewares'
import createHistory from 'history/createBrowserHistory'

import { signedIn, userID } from './global.js'
import App from './components/App.js'
import { pages, pagesMiddleware } from './pages.js'
import reducer from './reducers/index.js'
import {
  pageSelector, redirectedPageSelector, timelineSelector
} from './selectors.js'
import middleware from './middlewares/index.js'
import {
  push,
  setLoaded,
  initializeUser,
  addFavs, updateTimeline, setUser,
  setFollowing, setFollowers, updateNoticed, updateNotices,
  showError, hideError, doPing, setWindowFocused,
  clearRedirectedPage
} from './actions/index.js'
import { joinChannel, joinUserChannel } from './socket.js'
import { watchUserChannel } from './userChannel.js'

// Create the pagesMiddleware
const history = createHistory({})
const getCurrentPath = () => history.location.pathname
const pushPath = (path) => history.push(path)
const reduxPagesMiddleware = pages
  .middleware(pageSelector, getCurrentPath, pushPath)

const pushPathMiddleware = createAsyncHook(
  push.getType(),
  ({ action }) => pushPath(action.payload)
)

// Create the store
const middlewares = [middleware]
if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger()
  middlewares.push(logger)
}
const store = createStore(
  reducer,
  compose(
    applyMiddleware(
      reduxPagesMiddleware,
      pushPathMiddleware,
      pagesMiddleware,
      ...middlewares),
    autoRehydrate()
  )
)
persistStore(store, {whitelist: [
  'editorPlugins', 'failedPost', 'redirectedPage', 'trustedImageUsers'
]}, () => {
  if (signedIn) {
    const redirectedPage = redirectedPageSelector(store.getState())
    if (redirectedPage != null) {
      store.dispatch(clearRedirectedPage())
      store.dispatch(redirectedPage)
    }
  }
})

// Socket
const userChannelCallback = ({ userParams: { timeline, ...params }}) => {
  const { newPosts } = timelineSelector(store.getState())
  const { posts } = timeline
  const filteredPosts = posts.filter(({ id }) => {
    return !newPosts.some(({ id: newPostID }) => {
      return newPostID == id
    })
  })
  timeline.posts = filteredPosts
  Object.assign(params, {timeline})
  store.dispatch(initializeUser(params))
  store.dispatch(setLoaded(true))
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
  if (!signedIn) {
    store.dispatch(setLoaded(true))
  }
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

window.onfocus = () => store.dispatch(setWindowFocused(true))
window.onblur = () => store.dispatch(setWindowFocused(false))

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
