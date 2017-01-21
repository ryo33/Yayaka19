import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { setUserInfo } from '../actions.js'

const user = createReducer({
  [setUserInfo]: (state, { user }) => user
}, null)
const postCount = createReducer({
  [setUserInfo]: (state, { postCount }) => postCount
}, 0)
const following = createReducer({
  [setUserInfo]: (state, { following }) => following
}, 0)
const followers = createReducer({
  [setUserInfo]: (state, { followers }) => followers
}, 0)

export default combineReducers({
  user,
  postCount,
  following,
  followers
})
