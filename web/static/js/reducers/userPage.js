import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import {
  requestUser, setUserInfo
} from '../actions.js'

const user = createReducer({
  [setUserInfo]: (state, { user = null }) => user,
  [requestUser]: () => null
}, null)

const postCount = createReducer({
  [setUserInfo]: (state, { postCount = 0 }) => postCount
}, 0)

const following = createReducer({
  [setUserInfo]: (state, { following = 0 }) => following
}, 0)

const followers = createReducer({
  [setUserInfo]: (state, { followers = 0 }) => followers
}, 0)

const posts = createReducer({
  [setUserInfo]: (state, { posts = [] }) => posts
}, null)

export default combineReducers({
  user,
  postCount,
  following,
  followers,
  posts
})
