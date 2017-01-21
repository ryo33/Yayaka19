function getGlobal(key) {
  return window[key]
}

export const token = getGlobal('token')
export const signedIn = getGlobal('signedIn')
export const source = getGlobal('source')
