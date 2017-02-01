import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import {
  updatePostText, updatePostAddress, openNewPostDialog, closeNewPostDialog,
  submitPost
} from '../actions.js'

const text = createReducer({
  [updatePostText]: (state, payload) => payload,
  [submitPost]: () => '',
  [closeNewPostDialog]: () => ''
}, '')

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
  open, text, address, postAddresses
})
