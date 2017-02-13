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
