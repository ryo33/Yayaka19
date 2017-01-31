import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { setPost } from '../actions.js'

const post = createReducer({
  [setPost]: (state, post) => post
}, null)

export default combineReducers({
  post,
})
