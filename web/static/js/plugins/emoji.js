import emoji from 'node-emoji'

export default {
  transform(text) {
    return emoji.emojify(text)
  }
}

