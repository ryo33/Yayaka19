export default {
  transform(text) {
    const lines = text.split('\n')
    const maxLength = lines.length.toString().length
    return lines.map((line, index) => {
      const num = index.toString()
      const spaces = ' '.repeat(maxLength - num.length)
      return `${spaces}${num} ${line}`
    }).join('\n')
  }
}
