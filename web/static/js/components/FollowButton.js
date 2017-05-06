import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Button, Icon, Popup } from 'semantic-ui-react'

import { requestFollow, requestUnfollow } from '../actions/index.js'
import {
  userSelector, followingSelector, remoteFollowingSelector
} from '../selectors.js'

const mapStateToProps = (state, { user }) => {
  const currentUser = userSelector(state)
  const following = followingSelector(state)
  const remoteFollowing = remoteFollowingSelector(state)
  return {
    currentUser,
    user,
    following,
    remoteFollowing
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
    const host = this.getHost()
    requestFollow(user.name, host)
  }

  unfollow() {
    const { requestUnfollow, user } = this.props
    const host = this.getHost()
    requestUnfollow(user.name, host)
  }

  getHost() {
    const { user, host: post_host } = this.props
    return user.host || post_host
  }

  render() {
    const { currentUser, remoteFollowing, following, user, floated } = this.props
    const host = this.getHost()
    if (currentUser == null || (host == null && currentUser.id == user.id)) {
      return null
    }
    const isFollowing = host == null
      ? following.includes(user.name)
      : remoteFollowing.some(([h, n]) => h == host && n == user.name)
    if (isFollowing) {
      return (
        <Popup
          trigger={<Button size='mini' icon='user' color='blue' floated={floated} />}
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
        <Button size='mini' icon='add user' onClick={this.follow} floated={floated} />
      )
    }
  }
}

FollowButton.propTypes = {
  user: React.PropTypes.object.isRequired,
  floated: React.PropTypes.oneOf(['left', 'right'])
}

export default connect(mapStateToProps, actionCreators)(FollowButton)
