import { userChannel } from './socket.js'

import { addNotices } from './actions.js'

export const watchUserChannel = (store) => {
  userChannel.on("add_notices", payload => {
    store.dispatch(addNotices(payload))
  })
}
