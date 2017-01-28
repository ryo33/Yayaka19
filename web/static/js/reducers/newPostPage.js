import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import {
  updatePostAddress, openNewPostDialog, closeNewPostDialog,
  submitPost
} from '../actions.js'

const address = createReducer({
  [updatePostAddress]: (state, payload) => payload,
  [submitPost]: () => '',
  [closeNewPostDialog]: () => ''
}, '')

const postAddresses = createReducer({
  [submitPost]: () => [],
  [closeNewPostDialog]: () => []
}, [])

const open = createReducer({
  [openNewPostDialog]: () => true,
  [closeNewPostDialog]: () => false
}, false)

export default combineReducers({
  open, address, postAddresses
})
