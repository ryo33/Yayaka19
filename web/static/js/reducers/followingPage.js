import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import {
  requestFollowing, setFollowing
} from '../actions/followingPage.js'

const user = createReducer({
  [setFollowing]: (state, { user }) => user,
  [requestFollowing]: () => ({})
}, {})

const following = createReducer({
  [setFollowing]: (state, { following }) => following,
  [requestFollowing]: () => []
}, [])

const isLoadingFollowing = createReducer({
  [requestFollowing]: () => true,
  [setFollowing]: () => false
}, false)

export default combineReducers({
  user,
  following,
  isLoadingFollowing
})
