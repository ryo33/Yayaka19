import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { addOnlinePosts, showOnlinePosts } from '../actions.js'

const posts = createReducer({
  [addOnlinePosts]: (state, { posts }) => posts.concat(state)
}, [])

const count = createReducer({
  [addOnlinePosts]: (state, { count }) => state + count,
  [showOnlinePosts]: () => 0
}, 0)

export default combineReducers({
  posts, count
})
