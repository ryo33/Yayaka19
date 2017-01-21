import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { setHomePost } from '../actions.js'

const post = createReducer({
  [setHomePost]: (state, payload) => payload
}, {})

export default combineReducers({
  post
})
