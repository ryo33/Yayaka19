import { createAsyncHook } from 'redux-middlewares'

import { pushMessage, channel } from '../socket.js'
import { requestMysteries, setMysteries } from '../actions/index.js'

const requestMysteriesMiddleware = createAsyncHook(
  requestMysteries.getType(),
  ({ dispatch, action }) => {
    const name = action.payload
    pushMessage(channel, 'user_mysteries', {name})
      .then(({ user, mysteries }) => {
        dispatch(setMysteries(user, mysteries))
      })
      .catch(() => {})
  }
)

export default requestMysteriesMiddleware
