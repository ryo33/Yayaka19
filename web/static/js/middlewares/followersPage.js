import { createAsyncHook, composeMiddleware } from 'redux-middlewares'

import { pushMessage, channel } from '../socket.js'
import { requestFollowers, setFollowers } from '../actions/followersPage.js'

const requestFollowersMiddleware = createAsyncHook(
  requestFollowers.getType(),
  ({ dispatch, action }) => {
    const name = action.payload
    pushMessage(channel, 'followers', {name})
      .then(({ user, followers }) => {
        dispatch(setFollowers(user, followers))
      })
      .catch(() => {})
  }
)

export default requestFollowersMiddleware
