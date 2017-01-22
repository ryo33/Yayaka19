import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { updateTimeline } from '../actions.js'

const posts = createReducer({
  [updateTimeline]: (state, { posts }) => posts
}, [])

export default combineReducers({
  posts
})
