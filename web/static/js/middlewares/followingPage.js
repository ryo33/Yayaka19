import { createAsyncHook, composeMiddleware } from 'redux-middlewares'

import { pushMessage, channel } from '../socket.js'
import { requestFollowing, setFollowing } from '../actions/followingPage.js'

const requestFollowingMiddleware = createAsyncHook(
  requestFollowing.getType(),
  ({ dispatch, action }) => {
    const name = action.payload
    pushMessage(channel, 'following', {name})
      .then(({ user, following }) => {
        dispatch(setFollowing(user, following))
      })
      .catch(() => {})
  }
)

export default requestFollowingMiddleware

