import React, { Component } from 'react'
import { connect } from 'react-redux'
import queryString from 'query-string'

import { Button, Icon, Popup, Input } from 'semantic-ui-react'

import { requestFollow, requestUnfollow } from '../actions/index.js'
import {
  userSelector, followingSelector, remoteFollowingSelector
} from '../selectors.js'
import { remoteUserPage } from '../pages.js'

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
    const host = this.getHost()
    requestFollow(user.name, host)
  }

  unfollow() {
    const { requestUnfollow, user } = this.props
    const host = this.getHost()
    requestUnfollow(user.name, host)
  }

  changeHost(event) {
    this.setState({
      host: event.target.value
    })
  }

  getHost() {
    const { user, host: post_host } = this.props
    return user.host || post_host
  }

  render() {
    const { currentUser, remoteFollowing, following, user, floated } = this.props
    const host = this.getHost()
    if (host == null && currentUser.id == user.id) {
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
    } else if (currentUser == null || currentUser.name == null) {
      const path = remoteUserPage.path()
      const query = queryString.stringify({host: location.host, name: user.name})
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
