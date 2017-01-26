import { Socket } from 'phoenix'

import { token, userID } from './global.js'

export const socket = new Socket('/socket', {
  params: { token },
})

export const channel = socket.channel("page")
export const userChannel = socket.channel(`user:${userID}`)

export const pushMessage = (channel, event, params) => {
  return new Promise((resolve, reject) => {
    channel.push(event, params)
    .receive('ok', result => resolve(result))
    .receive('error', reasons => reject({ error: reasons }))
    .receive('timeout', () => reject({ timeout: true }))
  })
}

export const joinUserChannel = (respCallback) => {
  userChannel.join()
    .receive("ok", respCallback)
}

export const joinChannel = (respCallback) => {
  let errorCount = 0
  socket.onError(() => {
    errorCount += 1
    if (errorCount >= 2) {
      if (confirm("Failed to connect to the server. Do you want to reload?")) {
        window.location.reload(true)
      }
    }
  })
  socket.connect()
  channel.join()
    .receive("ok", respCallback)
}
