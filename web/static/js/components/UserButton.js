import React from 'react'
import { connect } from 'react-redux'

import { userPage } from '../pages.js'

const actionCreators = {
  userPageAction: userPage.action
}

const UserButton = ({ user, children, userPageAction, className }) => (
  <button onClick={() => userPageAction({name: user.name})} className={className}>
    {children}
  </button>
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
