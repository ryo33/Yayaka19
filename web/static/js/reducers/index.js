import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import { createPagesReducer } from 'redux-pages'

import { errorPage } from '../pages.js'
import {
  initializeUser,
  setUser, setFollowing, setFollowers,
  follow, unfollow,
  addFavs, fav, unfav,
  showError, hideError,
  setWindowFocused
} from '../actions/index.js'

import notices from './notices.js'
import newPostPage from './newPostPage.js'
import userPage from './userPage.js'
import followersPage from './followersPage.js'
import followingPage from './followingPage.js'
import mysteriesPage from './mysteriesPage.js'
import openedMysteriesPage from './openedMysteriesPage.js'
import postPage from './postPage.js'
import publicTimeline from './publicTimeline.js'
import timeline from './timeline.js'
import mysteryPage from './mysteryPage.js'
import editorPlugins from './editorPlugins.js'

const page = createPagesReducer(errorPage.name, {})

const user = createReducer({
  [setUser]: (state, payload) => payload,
  [initializeUser]: (state, { user }) => user
}, {})

const users = createReducer({
  [initializeUser]: (state, { users }) => users
}, [])

const following = createReducer({
  [setFollowing]: (state, payload) => payload,
  [follow]: (state, id) => [id, ...state],
  [unfollow]: (state, unfollowID) => state.filter(id => id !== unfollowID),
  [initializeUser]: (state, { following }) => following
}, [])

const followers = createReducer({
  [setFollowers]: (state, payload) => payload,
  [initializeUser]: (state, { followers }) => followers
}, [])

const favs = createReducer({
  [addFavs]: (state, payload) => [...new Set(state.concat(payload))],
  [fav]: (state, id) => [id, ...state],
  [unfav]: (state, unfavID) => state.filter(id => id !== unfavID),
  [initializeUser]: (state, { timeline: { favs }}) => favs
}, [])

const error = createReducer({
  [showError]: (state, payload) => payload,
  [hideError]: () => null
}, null)

const windowFocused = createReducer({
  [setWindowFocused]: (state, payload) => payload
}, true)

export default combineReducers({
  error,
  notices,
  page,
  user,
  users,
  following,
  followers,
  favs,
  newPostPage,
  userPage,
  followersPage,
  followingPage,
  mysteriesPage,
  openedMysteriesPage,
  postPage,
  publicTimeline,
  timeline,
  mysteryPage,
  windowFocused,
  editorPlugins
})
