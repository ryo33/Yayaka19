import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import {
  requestTrustedServers, setTrustedServers,
  trustServer, untrustServer
} from '../actions/index.js'

const user = createReducer({
  [setTrustedServers]: (state, { user }) => user,
  [requestTrustedServers]: () => ({})
}, {})

const trustedServers = createReducer({
  [setTrustedServers]: (state, { trustedServers }) => trustedServers,
  [requestTrustedServers]: () => [],
  [trustServer]: (state, server) => state.concat(server),
  [untrustServer]: (state, untrustID) => state.filter(({ id }) => id != untrustID)
}, [])

const isLoadingTrustedServers = createReducer({
  [requestTrustedServers]: () => true,
  [setTrustedServers]: () => false
}, false)

export default combineReducers({
  user,
  trustedServers,
  isLoadingTrustedServers
})
