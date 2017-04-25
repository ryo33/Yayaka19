import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { saveFailedPost, resubmitFailedPost, dismissFailedPost } from '../actions'

const payload = createReducer({
  [saveFailedPost]: (state, payload) => payload,
  [resubmitFailedPost]: () => null,
  [dismissFailedPost]: () => null
}, null)

export default combineReducers({
  payload
})
