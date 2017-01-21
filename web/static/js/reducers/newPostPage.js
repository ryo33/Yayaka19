import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { updatePostText } from '../actions.js'

const text = createReducer({
  [updatePostText]: (state, payload) => payload
}, '')

export default combineReducers({
  text,
})
