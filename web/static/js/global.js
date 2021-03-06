function getGlobal(key) {
  return window[key]
}

export const title = getGlobal('title')
export const token = getGlobal('token')
export const signedIn = getGlobal('signedIn')
export const userID = getGlobal('userID')
export const source = getGlobal('source')
export const admin = getGlobal('admin')
export const hashtag = getGlobal('hashtag')
export const providers = getGlobal('providers')
export const slogan = getGlobal('slogan')
export const trustedHosts = getGlobal('trustedHosts')
