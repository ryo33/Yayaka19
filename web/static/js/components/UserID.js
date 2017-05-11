import React from 'react'

import { isRemoteHost } from '../utils.js'

export default ({ user }) => {
  const host = user.host
  if (isRemoteHost(host)) {
    return <span>{user.name}@{host}</span>
  } else {
    return <span>@{user.name}</span>
  }
}
