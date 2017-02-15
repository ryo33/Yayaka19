export function handleChange(plugins, text) {
  const optionsList = plugins.map((plugin, index) => {
    return {plugin: index, ...plugin.handleChange(text)}
  })
  return Array.prototype.concat.apply([], optionsList)
}

export function handleSelect(plugins, text, option) {
  const { index } = option
  return plugins[index].handleSelect(text, option)
}

export function transform(plugins, text) {
  return plugins.reduce((text, plugin) => {
    if (plugin.transform) {
      return plugin.transform(text)
    } else {
      return text
    }
  }, text)
}
