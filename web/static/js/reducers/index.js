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
  setWindowFocused,
  saveRedirectedPage, clearRedirectedPage
} from '../actions/index.js'

import notices from './notices.js'
import newPostPage from './newPostPage.js'
import failedPost from './failedPost.js'
import userPage from './userPage.js'
import followersPage from './followersPage.js'
import followingPage from './followingPage.js'
import mysteriesPage from './mysteriesPage.js'
import openedMysteriesPage from './openedMysteriesPage.js'
import trustedServersPage from './trustedServersPage.js'
import postPage from './postPage.js'
import publicTimeline from './publicTimeline.js'
import timeline from './timeline.js'
import mysteryPage from './mysteryPage.js'
import editorPlugins from './editorPlugins.js'

const page = createPagesReducer(errorPage.name, {})

const redirectedPage = createReducer({
  [saveRedirectedPage]: (state, payload) => payload,
  [clearRedirectedPage]: () => null
}, null)

const user = createReducer({
  [setUser]: (state, payload) => payload,
  [initializeUser]: (state, { user }) => user
}, {})

const users = createReducer({
  [initializeUser]: (state, { users }) => users
}, [])

const following = createReducer({
  [setFollowing]: (state, payload) => payload,
  [follow]: (state, {name, host}) => host == null ? [name, ...state] : state,
  [unfollow]: (state, {name: unfollowName, host}) => host == null
    ? state.filter(name => name !== unfollowName) : state,
  [initializeUser]: (state, { following }) => following
}, [])

const remoteFollowing = createReducer({
  [follow]: (state, {name, host}) => host == null ? state : [[host, name], ...state],
  [unfollow]: (state, {name: unfollowName, host: unfollowHost}) => unfollowHost == null
    ? state : state.filter(([host, name]) => host !== unfollowHost || name !== unfollowName),
  [initializeUser]: (state, { remoteFollowing }) => remoteFollowing
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
  redirectedPage,
  user,
  users,
  following,
  remoteFollowing,
  followers,
  favs,
  newPostPage,
  failedPost,
  userPage,
  followersPage,
  followingPage,
  mysteriesPage,
  openedMysteriesPage,
  trustedServersPage,
  postPage,
  publicTimeline,
  timeline,
  mysteryPage,
  windowFocused,
  editorPlugins
})
