import { userPage } from '../pages.js'

const nameRegex = / @(\S+)/

function charAtFromEnd(text, index) {
  text[text.length - 1 - index]
}

export default {
  handleChange(text, nextText) {
    const matched = nextText.match(nameRegex)
    if (matched) {
      const value = matched[1]
      const text = `@${value}`
      return [{value, text}]
    } else {
      return []
    }
  },
  handleSelect(text, option) {
    const name = option.value
    const re = new RegExp(`@${name}$`)
    const url = location.origin + userPage.path({name})
    return text.replace(re, `@${name} (${url})`)
  }
}
