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
  const url = encodeURIComponent(window.location.origin + postPage.path({id: post.id}))
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

export function getPostKey(post) {
  if (post.host) {
    return `${post.host}/${post.id}`
  } else {
    return post.id
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
