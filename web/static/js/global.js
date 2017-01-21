function getGlobal(key) {
  return window[key]
}

export const token = getGlobal('token')
export const source = getGlobal('source')
