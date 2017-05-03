import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import {
  requestFollowingServers, setFollowingServers,
  followServer, unfollowServer
} from '../actions/index.js'

const user = createReducer({
  [setFollowingServers]: (state, { user }) => user,
  [requestFollowingServers]: () => ({})
}, {})

const followingServers = createReducer({
  [setFollowingServers]: (state, { followingServers }) => followingServers,
  [requestFollowingServers]: () => [],
  [followServer]: (state, server) => state.concat(server),
  [unfollowServer]: (state, unfollowID) => state.filter(({ id }) => id != unfollowID)
}, [])

const isLoadingFollowingServers = createReducer({
  [requestFollowingServers]: () => true,
  [setFollowingServers]: () => false
}, false)

export default combineReducers({
  user,
  followingServers,
  isLoadingFollowingServers
})
