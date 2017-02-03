import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Button, Icon, Popup } from 'semantic-ui-react'

import { requestFollow, requestUnfollow } from '../actions.js'
import { userSelector, followingSelector } from '../selectors.js'

const mapStateToProps = (state, { user }) => {
  const currentUser = userSelector(state)
  const following = followingSelector(state)
  return {
    currentUser,
    user,
    following
  }
}

const actionCreators = {
  requestFollow, requestUnfollow
}

class FollowButton extends Component {
  constructor(props) {
    super(props)
    this.follow = this.follow.bind(this)
    this.unfollow = this.unfollow.bind(this)
  }

  follow() {
    const { requestFollow, user } = this.props
    requestFollow(user.id)
  }

  unfollow() {
    const { requestUnfollow, user } = this.props
    requestUnfollow(user.id)
  }

  render() {
    const { currentUser, following, user } = this.props
    if (currentUser == null || currentUser.id == user.id) {
      return null
    }
    if (following.includes(user.id)) {
      return (
        <Popup
          trigger={<Button size='mini' icon='user' color='blue' />}
          flowing
          hoverable
          on='click'
          hideOnScroll
        >
          <Button color='red' onClick={this.unfollow}><Icon name='remove user' />Unfollow</Button>
        </Popup>
      )
    } else {
      return (
        <Button size='mini' icon='add user' onClick={this.follow} />
      )
    }
  }
}

FollowButton.propTypes = {
  user: React.PropTypes.object.isRequired,
}

export default connect(mapStateToProps, actionCreators)(FollowButton)
