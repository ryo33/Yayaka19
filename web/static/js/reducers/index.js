import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import { createPagesReducer } from 'redux-pages'

import { errorPage } from '../pages.js'
import {
  setUser, setFollowing, follow, unfollow,
  addFavs, fav, unfav,
  showError, hideError
} from '../actions.js'

import notices from './notices.js'
import newPostPage from './newPostPage.js'
import userPage from './userPage.js'
import postPage from './postPage.js'
import publicTimeline from './publicTimeline.js'
import timeline from './timeline.js'

const page = createPagesReducer(errorPage.name, {})

const user = createReducer({
  [setUser]: (state, payload) => payload
}, null)

const following = createReducer({
  [setFollowing]: (state, payload) => payload,
  [follow]: (state, id) => [id, ...state],
  [unfollow]: (state, unfollowID) => state.filter(id => id !== unfollowID),
}, [])

const favs = createReducer({
  [addFavs]: (state, payload) => [...new Set(state.concat(payload))],
  [fav]: (state, id) => [id, ...state],
  [unfav]: (state, unfavID) => state.filter(id => id !== unfavID),
}, [])

const error = createReducer({
  [showError]: (state, payload) => payload,
  [hideError]: () => null
}, null)

export default combineReducers({
  error,
  notices,
  page,
  user,
  following,
  favs,
  newPostPage,
  userPage,
  postPage,
  publicTimeline,
  timeline
})
