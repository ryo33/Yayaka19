import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import {
  updatePostText, updatePostAddress, openNewPostDialog, closeNewPostDialog,
  submitPost
} from '../actions/index.js'

const text = createReducer({
  [updatePostText]: (state, payload) => payload,
  [submitPost]: () => '',
}, '')

const address = createReducer({
  [updatePostAddress]: (state, payload) => payload,
  [submitPost]: () => null,
  [closeNewPostDialog]: () => null
}, null)

const postAddresses = createReducer({
  [submitPost]: () => [],
  [closeNewPostDialog]: () => []
}, [])

const open = createReducer({
  [openNewPostDialog]: () => true,
  [closeNewPostDialog]: () => false
}, false)

export default combineReducers({
  open, text, address, postAddresses
})
