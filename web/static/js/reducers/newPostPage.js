import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { updatePostText, updatePostAddress } from '../actions.js'

const text = createReducer({
  [updatePostText]: (state, payload) => payload
}, '')

const address = createReducer({
  [updatePostAddress]: (state, payload) => payload
}, '')

const postAddresses = createReducer({
}, [])

export default combineReducers({
  text, address, postAddresses
})
