import { createAsyncHook } from 'redux-middlewares'

import { pushMessage, channel } from '../socket.js'
import { requestOpenedMysteries, setOpenedMysteries } from '../actions/index.js'

const requestOpenedMysteriesMiddleware = createAsyncHook(
  requestOpenedMysteries.getType(),
  ({ dispatch, action }) => {
    const name = action.payload
    pushMessage(channel, 'opened_mysteries', {name})
      .then(({ user, mysteries }) => {
        dispatch(setOpenedMysteries(user, mysteries))
      })
      .catch(() => {})
  }
)

export default requestOpenedMysteriesMiddleware
