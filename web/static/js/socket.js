import { Socket } from 'phoenix'

import { token } from './global.js'

export const socket = new Socket('/socket', {
  params: { token },
})

export const channel = socket.channel("user")

export const pushMessage = (event, params) => {
  return new Promise((resolve, reject) => {
    channel.push(event, params)
    .receive('ok', result => resolve(result))
    .receive('error', reasons => reject({ error: reasons }))
    .receive('timeout', () => reject({ timeout: true }))
  })
}

export const joinChannel = (respCallback, errorCallback) => {
  socket.onError(() => {
    if (confirm("Failed to connect to the server. Do you want to reload?")) {
      errorCallback()
    }
  })
  socket.connect()
  channel.join()
    .receive("ok", respCallback)
}
