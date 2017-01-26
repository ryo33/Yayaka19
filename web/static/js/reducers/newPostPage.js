import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { updatePostAddress } from '../actions.js'

const address = createReducer({
  [updatePostAddress]: (state, payload) => payload
}, '')

const postAddresses = createReducer({
}, [])

export default combineReducers({
  address, postAddresses
})
