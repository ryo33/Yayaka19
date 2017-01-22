import React, { Component } from 'react'
import { connect } from 'react-redux'

import { requestFollow, requestUnfollow } from '../actions.js'
import { userSelector, userPageSelector, followingSelector } from '../selectors.js'

const mapDispatchToProps = state => {
  const user = userSelector(state)
  const userPage = userPageSelector(state)
  return {
    following: followingSelector(state),
    isNotMe: user && userPage.user && userPage.user.id !== user.id,
    userPage
  }
}

const actionCreators = {
  requestFollow, requestUnfollow
}

class UserPage extends Component {
  constructor(props) {
    super(props)
    this.follow = this.follow.bind(this)
    this.unfollow = this.unfollow.bind(this)
  }

  follow() {
    const { requestFollow, userPage } = this.props
    requestFollow(userPage.user.id)
  }

  unfollow() {
    const { requestUnfollow, userPage } = this.props
    requestUnfollow(userPage.user.id)
  }

  renderFollowButton() {
    const { following, userPage } = this.props
    if (following.includes(userPage.user.id)) {
      return (
        <button onClick={this.unfollow}>Following</button>
      )
    } else {
      return (
        <button onClick={this.follow}>Follow</button>
      )
    }
  }

  render() {
    const { isNotMe, userPage } = this.props
    const { user, postCount, following, followers } = userPage
    if (user != null) {
      return (
        <div>
          <ul>
            {
              isNotMe
                ? this.renderFollowButton()
                : <p>a</p>
            }
            <li>Display: {user.display}</li>
            <li>Name: {user.name}</li>
            <li>Number of posts: {postCount}</li>
            <li>Following: {following}</li>
            <li>Followers: {followers}</li>
          </ul>
        </div>
      )
    } else {
      return (
        <div>
        </div>
      )
    }
  }
}

export default connect(mapDispatchToProps, actionCreators)(UserPage)
