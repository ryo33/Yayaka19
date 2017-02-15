import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Radio } from 'semantic-ui-react'

import { pluginsList, pluginsObject } from '../editorPlugins.js'
import { editorPluginsSelector } from '../selectors.js'
import { updatePlugins } from '../actions/editorPlugins.js'

const mapStateToProps = state => {
  const { plugins } = editorPluginsSelector(state)
  return {
    plugins
  }
}

const actionCreators = {
  updatePlugins
}

class EditorPluginsSelector extends Component {
  constructor(props) {
    super(props)
  }

  remove(name) {
    const { plugins, updatePlugins } = this.props
    updatePlugins(plugins.filter(plugin => plugin !== name))
  }

  add(name) {
    const { plugins, updatePlugins } = this.props
    updatePlugins(plugins.concat([name]))
  }

  render() {
    const { plugins } = this.props
    return (
      <div>
        {
          pluginsList.map(({ id, name }) => {
            const active = plugins.includes(id)
            const handler = () => active ? this.remove(id) : this.add(id)
            return (
              <Radio
                toggle
                key={name}
                label={name}
                onChange={handler}
                checked={active}
              />
            )
          })
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(EditorPluginsSelector)
