import React from 'react'

export default ({ host: post_host, user }) => {
  const host = user.host || post_host
  if (host) {
    return <span>{host}@{user.name}</span>
  } else {
    return <span>@{user.name}</span>
  }
}
