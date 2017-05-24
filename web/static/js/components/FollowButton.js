import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Button, Icon, Popup, Input } from 'semantic-ui-react'

import { requestFollow, requestUnfollow } from '../actions/index.js'
import {
  userSelector, followingSelector, remoteFollowingSelector
} from '../selectors.js'
import { remoteUserPage, getRemoteUserPageQuery } from '../pages.js'
import { isRemoteHost } from '../utils.js'

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
    this.changeHost = this.changeHost.bind(this)
    this.state = {
      host: ''
    }
  }

  follow() {
    const { requestFollow, user } = this.props
    const host = user.host
    requestFollow(user.name, host)
  }

  unfollow() {
    const { requestUnfollow, user } = this.props
    const host = user.host
    requestUnfollow(user.name, host)
  }

  changeHost(event) {
    this.setState({
      host: event.target.value
    })
  }

  render() {
    const { currentUser, remoteFollowing, following, user, floated, large } = this.props
    const host = user.host
    if (!isRemoteHost(host) && currentUser.name == user.name) {
      return null
    }
    const isFollowing = isRemoteHost(host)
      ? remoteFollowing.some(([h, n]) => h == host && n == user.name)
      : following.includes(user.name)
    if (isFollowing) {
      return (
        <Popup
          trigger={large ? (
            <Button color='blue' floated={floated}>
              <Icon name='user' />
              Following
            </Button>
          ) : (
            <Button size='mini' icon='user' color='blue' floated={floated} />
          )}
          flowing
          hoverable
          on='click'
          hideOnScroll
        >
          <Button color='red' onClick={this.unfollow}><Icon name='remove user' />Unfollow</Button>
        </Popup>
      )
    } else if (currentUser == null || currentUser.name == null) {
      const path = remoteUserPage.path()
      const query = getRemoteUserPageQuery(user.host || location.host, user.name)
      const url = `https://${this.state.host}${path}?${query}`
      return (
        <Popup
          trigger={(
            <Button size='mini' floated={floated}>
              <Icon name='add user' />
              Remote Follow
            </Button>
          )}
          flowing
          hoverable
          on='click'
          hideOnScroll
        >
          <Input size='mini' value={this.state.host}
            placeholder='Host' onChange={this.changeHost} />
          {this.state.host.length != 0 ? (
            <Button as='a' href={url}>
              <Icon name='external' />
              Open
            </Button>
          ) : null}
        </Popup>
      )
    } else {
      if (large) {
        return (
          <Button onClick={this.follow} floated={floated}>
            <Icon name='add user' color='blue' />
            Follow
          </Button>
        )
      } else {
        return (
          <Button icon size='mini' onClick={this.follow} floated={floated}>
            <Icon name='add user' color='blue' />
          </Button>
        )
      }
    }
  }
}

FollowButton.propTypes = {
  user: React.PropTypes.object.isRequired,
  floated: React.PropTypes.oneOf(['left', 'right']),
  large: React.PropTypes.bool
}

export default connect(mapStateToProps, actionCreators)(FollowButton)
