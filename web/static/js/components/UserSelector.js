import React, { Component } from 'react'

import { Dropdown } from 'semantic-ui-react'

class UserSelector extends Component {
  render() {
    const { users, currentUser, onChange } = this.props
    const options = users.map(({ name, display }) => {
      return {
        key: name, value: name,
        text: `${display} @${name}`
      }
    })
    return (
      <Dropdown search selection name="user"
        onChange={(e, { value }) => onChange(value)}
        options={options} value={currentUser} />
    )
  }
}

export default UserSelector
