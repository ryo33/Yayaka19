import React from 'react'
import { Label } from 'semantic-ui-react'

const PluginsButton = ({ plugins, onClick }) => {
  return (
    <Label basic as='a' icon='puzzle' content={plugins.length} size='large'
      onClick={onClick} />
  )
}

export default PluginsButton
