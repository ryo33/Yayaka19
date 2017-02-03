export const compareNotices = (a, b) => {
  if (a.inserted_at > b.inserted_at) {
    return -1
  } else if (a.inserted_at < b.inserted_at) {
    return 1
  } else {
    return 0
  }
}

export const getTweetURL = link => {
  const url = encodeURIComponent(window.location.origin + link)
  return `https://twitter.com/intent/tweet?url=${url}`
}
