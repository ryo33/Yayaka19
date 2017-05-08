import React from 'react'

import { isRemoteHost } from '../utils.js'

export default ({ host: post_host, user }) => {
  const host = user.host || post_host
  if (isRemoteHost(host)) {
    return <span>{host}@{user.name}</span>
  } else {
    return <span>@{user.name}</span>
  }
}
