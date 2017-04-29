import { createAsyncHook, composeMiddleware } from 'redux-middlewares'

import { signedIn } from '../global.js'
import { pushMessage, channel, userChannel } from '../socket.js'
import {
  requestFollowingServers,
  requestFollowServer,
  requestUnfollowServer,
  setFollowingServers,
  followServer,
  unfollowServer,
  showError
} from '../actions/index.js'

const requestFollowingServersMiddleware = createAsyncHook(
  requestFollowingServers.getType(),
  ({ dispatch, action }) => {
    const name = action.payload
    pushMessage(channel, 'following_servers', {name})
      .then(({ user, servers }) => {
        dispatch(setFollowingServers(user, servers))
      })
      .catch(() => {})
  }
)

const requestFollowServerMiddleware = createAsyncHook(
  requestFollowServer.getType(),
  ({ dispatch, action }) => {
    const host = action.payload
    pushMessage(userChannel, 'follow_server', {host})
      .then(({ server }) => {
        dispatch(followServer(server))
      }).catch((resp) => {
        dispatch(showError('Failed to follow the server.'))
      })
  }
)

const requestUnfollowServerMiddleware = createAsyncHook(
  requestUnfollowServer.getType(),
  ({ dispatch, action }) => {
    const id = action.payload
    pushMessage(userChannel, 'unfollow_server', {id})
      .then(resp => {
        dispatch(unfollowServer(id))
      }).catch(() => {
        dispatch(showError('Failed to unfollow the server.'))
      })
  }
)

let signedInMiddlewares = []
if (signedIn) {
  signedInMiddlewares = [
    requestFollowServerMiddleware,
    requestUnfollowServerMiddleware
  ]
}

export default composeMiddleware(
  requestFollowingServersMiddleware,
  ...signedInMiddlewares,
)
