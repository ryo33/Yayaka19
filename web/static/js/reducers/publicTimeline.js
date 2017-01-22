import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { updatePublicTimeline } from '../actions.js'

const posts = createReducer({
  [updatePublicTimeline]: (state, { posts }) => posts
}, [])

export default combineReducers({
  posts
})
