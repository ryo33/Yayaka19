import { userPage } from '../pages.js'

const nameRegex = / @(\S+)/

function charAtFromEnd(text, index) {
  text[text.length - 1 - index]
}

export default {
  handleChange(text, nextText) {
    if (nextText.length === text.length + 1) {
      if (charAtFromEnd(nextText, 1) === charAtFromEnd(text, 0)) {
        // Only when added to the end
        const matched = nextText.match(nameRegex)
        if (matched) {
          const value = matched[1]
          const text = `@${value}`
          return [{value, text}]
        }
      }
    }
    return []
  },
  handleSelect(text, option) {
    const name = option.value
    const re = new RegExp(`@${name}$`)
    const url = location.origin + userPage.path({name})
    return text.replace(re, `@${name} (${url})`)
  }
}
