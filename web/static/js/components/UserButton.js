import React from 'react'
import { connect } from 'react-redux'

import { Button, Icon } from 'semantic-ui-react'

import { userPage, remoteUserPage, getRemoteUserPageQuery } from '../pages.js'
import { isRemoteHost } from '../utils.js'
import Link from './Link.js'

const actionCreators = {
  userPageAction: name => userPage.action({name})
}

const UserButton = ({ Component = Button, user, children, userPageAction }) => {
  const host = user.host
  if (isRemoteHost(host)) {
    const path = remoteUserPage.path()
    const query = getRemoteUserPageQuery(host, user.name)
    const href = `${path}?${query}`
    return (
      <Link href={href} as={Component} size='mini'>
        {children}
      </Link>
    )
  } else {
    const link = userPage.path({name: user.name})
    return (
      <Component size='mini' href={link} onClick={event => {
        event.preventDefault()
        userPageAction(user.name)
      }}>
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
