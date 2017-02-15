import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import {
  requestFollowers, setFollowers
} from '../actions/followersPage.js'

const user = createReducer({
  [setFollowers]: (state, { user }) => user,
  [requestFollowers]: () => ({})
}, {})

const followers = createReducer({
  [setFollowers]: (state, { followers }) => followers,
  [requestFollowers]: () => []
}, [])

const isLoadingFollowers = createReducer({
  [requestFollowers]: () => true,
  [setFollowers]: () => false
}, false)

export default combineReducers({
  user,
  followers,
  isLoadingFollowers
})
