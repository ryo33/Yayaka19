import { postPage } from './pages.js'

export const compareNotices = (a, b) => {
  if (a.inserted_at > b.inserted_at) {
    return -1
  } else if (a.inserted_at < b.inserted_at) {
    return 1
  } else {
    return 0
  }
}

export const getTweetURL = post => {
  const url = encodeURIComponent(window.location.origin + postPage.path({id: post.id}))
  const text = encodeURIComponent(`“${post.text}” - ${post.user.display} (${post.user.name})`)
  return `https://twitter.com/intent/tweet?url=${url}&text=${text}`
}
