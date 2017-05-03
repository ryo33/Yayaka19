import React from 'react'
import { connect } from 'react-redux'

import { Button, Icon } from 'semantic-ui-react'

import { userPage } from '../pages.js'
import { createRemotePath } from '../utils.js'

const actionCreators = {
  userPageAction: name => userPage.action({name})
}

const UserButton = ({ Component = Button,
  host: post_host, user, children, userPageAction }) => {
  const host = user.host || post_host
  if (host) {
    return (
      <Component size='mini' as='a' href={createRemotePath(host, user.path)}>
        {children}
      </Component>
    )
  } else {
    const link = userPage.path({name: user.name})
    return (
      <Component size='mini' href={link} onClick={() => userPageAction(user.name)}>
        {children}
      </Component>
    )
  }
}

const component = connect(null, actionCreators)(UserButton)

component.propTypes = {
  Component: React.PropTypes.func,
  children: React.PropTypes.node,
  host: React.PropTypes.string,
  user: React.PropTypes.shape({
    host: React.PropTypes.string,
    path: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    display: React.PropTypes.string.isRequired
  }).isRequired,
}

export default component
