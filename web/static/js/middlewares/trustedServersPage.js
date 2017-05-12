import { createAsyncHook, composeMiddleware } from 'redux-middlewares'

import { signedIn } from '../global.js'
import { pushMessage, channel, userChannel } from '../socket.js'
import {
  requestTrustedServers,
  requestTrustServer,
  requestUntrustServer,
  setTrustedServers,
  trustServer,
  untrustServer,
  showError
} from '../actions/index.js'

const requestTrustedServersMiddleware = createAsyncHook(
  requestTrustedServers.getType(),
  ({ dispatch, action }) => {
    const name = action.payload
    pushMessage(channel, 'trusted_servers', {name})
      .then(({ user, servers }) => {
        dispatch(setTrustedServers(user, servers))
      })
      .catch(() => {})
  }
)

const requestTrustServerMiddleware = createAsyncHook(
  requestTrustServer.getType(),
  ({ dispatch, action }) => {
    const host = action.payload
    pushMessage(userChannel, 'trust_server', {host})
      .then(({ server }) => {
        dispatch(trustServer(server))
      }).catch((resp) => {
        dispatch(showError('Failed to follow the server.'))
      })
  }
)

const requestUntrustServerMiddleware = createAsyncHook(
  requestUntrustServer.getType(),
  ({ dispatch, action }) => {
    const id = action.payload
    pushMessage(userChannel, 'untrust_server', {id})
      .then(resp => {
        dispatch(untrustServer(id))
      }).catch(() => {
        dispatch(showError('Failed to unfollow the server.'))
      })
  }
)

let signedInMiddlewares = []
if (signedIn) {
  signedInMiddlewares = [
    requestTrustServerMiddleware,
    requestUntrustServerMiddleware
  ]
}

export default composeMiddleware(
  requestTrustedServersMiddleware,
  ...signedInMiddlewares,
)
