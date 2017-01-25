import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Button, Icon } from 'semantic-ui-react'

import { requestFollow, requestUnfollow } from '../actions.js'
import { userSelector, followingSelector } from '../selectors.js'

const mapStateToProps = (state, { user: targetUser }) => {
  const user = userSelector(state)
  const following = followingSelector(state)
  return {
    user,
    targetUser,
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
    const { requestFollow, targetUser } = this.props
    requestFollow(targetUser.id)
  }

  unfollow() {
    const { requestUnfollow, targetUser } = this.props
    requestUnfollow(targetUser.id)
  }

  render() {
    const { user, following, targetUser } = this.props
    if (user == null || user.id == targetUser.id) {
      return null
    }
    if (following.includes(targetUser.id)) {
      return (
        <Button primary onClick={this.unfollow}>
          <Button.Content>
            Following
          </Button.Content>
        </Button>
      )
    } else {
      return (
        <Button onClick={this.follow}>
          <Button.Content>
            <Icon name='add user' />
            Follow
          </Button.Content>
        </Button>
      )
    }
  }
}

FollowButton.propTypes = {
  user: React.PropTypes.object.isRequired,
}

export default connect(mapStateToProps, actionCreators)(FollowButton)
