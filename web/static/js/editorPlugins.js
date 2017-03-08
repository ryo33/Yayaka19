import transformUsername from './plugins/transformUsername.js'
import number from './plugins/number.js'

export const pluginsList = [{
  id: 'transformUsername',
  name: '@username to link',
  ...transformUsername,
  description: ''
}, {
  id: 'line number',
  name: 'number',
  ...number,
  description: ''
}]

const pluginsObject = {}
pluginsList.forEach(plugin => {
  pluginsObject[plugin.id] = plugin
})

export const handlers = {
  handleChange(plugins, text, nextText) {
    const optionsList = plugins.map((pluginName, index) => {
      const plugin = pluginsObject[pluginName]
      if (plugin.handleChange) {
        const options = plugin.handleChange(text, nextText)
        return options.map(option => {
          const id = `${plugin.id}/${option.text}`
          return {id, plugin: plugin.id, ...option}
        })
      } else {
        return []
      }
    })
    return Array.prototype.concat.apply([], optionsList)
  },
  handleSelect(plugins, text, option) {
    const plugin = pluginsObject[option.plugin]
    return plugin.handleSelect(text, option)
  },
  transform(plugins, text) {
    return plugins.reduce((text, pluginName) => {
      const plugin = pluginsObject[pluginName]
      if (plugin.transform) {
        return plugin.transform(text)
      } else {
        return text
      }
    }, text)
  }
}
