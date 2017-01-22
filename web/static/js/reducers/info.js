import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { updateInfo } from '../actions.js'

const posts = createReducer({
  [updateInfo]: (state, { posts }) => posts
}, 0)

const users = createReducer({
  [updateInfo]: (state, { users }) => users
}, 0)

export default combineReducers({
  posts,
  users
})
