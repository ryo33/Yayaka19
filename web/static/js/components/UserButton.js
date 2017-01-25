import React from 'react'
import { connect } from 'react-redux'

import { Button } from 'semantic-ui-react'

import { userPage } from '../pages.js'

const actionCreators = {
  userPageAction: userPage.action
}

const UserButton = ({ user, children, userPageAction }) => (
  <Button size='mini' onClick={() => userPageAction({name: user.name})}>
    {children}
  </Button>
)

const component = connect(null, actionCreators)(UserButton)

component.propTypes = {
  children: React.PropTypes.node,
  user: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    display: React.PropTypes.string.isRequired
  }).isRequired,
}

export default component
