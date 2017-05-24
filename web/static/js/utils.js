import React from 'react'

import { Segment, Icon } from 'semantic-ui-react'

import { postPage } from './pages.js'
import { hashtag } from './global.js'

export const compareInsertedAtDesc = (a, b) => {
  if (a.inserted_at > b.inserted_at) {
    return -1
  } else if (a.inserted_at < b.inserted_at) {
    return 1
  } else {
    return 0
  }
}

export const compareNotices = compareInsertedAtDesc

export const getTweetURL = post => {
  const url = encodeURIComponent(`https://${post.host || location.host}${postPage.path({id: post.id})}`)
  const text = encodeURIComponent(`“${post.text}” - ${post.user.display} (${post.user.name})`)
  const hashtags = encodeURIComponent(hashtag)
  return `https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=${hashtags}`
}

export const DEFAULT_CHANNEL = `@@/${title}/DEFAULT_CHANNEL`

export function isDefaultChannel(channel) {
  return channel == null || channel === DEFAULT_CHANNEL
}

export function createRemotePath(host, path) {
  if (path) {
    return `https://${host}${path}`
  } else {
    return null
  }
}

export function isRemoteHost(host) {
  return host != null && host != location.host
}

export function getLocalID(post) {
  return post.remote_id || post.id
}

export function getPostKey(post) {
  if (isRemoteHost(post.host)) {
    return `${post.host}/${post.id}`
  } else {
    return post.remote_id || post.id
  }
}

export function getPostsFooters(posts, localFooter = null) {
  const endOfHosts = {}
  let endOfLocal = null
  posts.forEach(post => {
    const { host } = post
    if (isRemoteHost(host)) {
      endOfHosts[host] = post
    } else {
      endOfLocal = post
    }
  })
  const footers = {}
  Object.keys(endOfHosts).forEach(host => {
    footers[getPostKey(endOfHosts[host])] = (
      <Segment basic secondary>
        <Icon size='large' name='anchor' />
        The end of posts from <Icon name='external' /> <a href={`https://${host}`}>{host}</a>
      </Segment>
    )
  })
  if (endOfLocal != null) {
    footers[getPostKey(endOfLocal)] = localFooter
  }
  return footers
}

export function isSameUser(user1, user2) {
  if (user1 == null || user2 == null) return false
  const { host: host1, name: name1 } = user1
  const { host: host2, name: name2 } = user2
  const isSameRemoteUser = isRemoteHost(host1)
    && isRemoteHost(host2)
    && host1 == host2
    && name1 == name2
  const isSameLocalUser = !isRemoteHost(host1)
    && !isRemoteHost(host2)
    && name1 == name2
  return isSameRemoteUser || isSameLocalUser
}
