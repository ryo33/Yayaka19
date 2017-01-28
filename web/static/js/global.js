function getGlobal(key) {
  return window[key]
}

export const token = getGlobal('token')
export const signedIn = getGlobal('signedIn')
export const userID = getGlobal('userID')
export const source = getGlobal('source')
export const admin = getGlobal('admin')
