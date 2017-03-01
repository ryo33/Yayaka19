import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Label } from 'semantic-ui-react'

import { editorPluginsSelector } from '../selectors.js'
import { handlers } from '../editorPlugins.js'

class EditorPluginsOptions extends Component {
  handleClickOption(option) {
    const { plugins, onChange, text } = this.props
    const nextText = handlers.handleSelect(plugins, text, option)
    onChange(nextText)
  }

  render() {
    const { text, previousText, plugins } = this.props
    const options = handlers.handleChange(plugins, previousText, text)
    return (
      <span>
        {
          options.map(option => (
            <Label basic as='a' key={option.id} content={option.text}
              onClick={() => this.handleClickOption(option)} />
          ))
        }
      </span>
    )
  }
}

export default EditorPluginsOptions
