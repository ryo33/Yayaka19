import React, { Component } from 'react'
import { connect } from 'react-redux'

import { userSelector, userPageSelector, followingSelector } from '../selectors.js'

import FollowButton from './FollowButton.js'

const mapStateToProps = state => {
  const user = userSelector(state)
  const userPage = userPageSelector(state)
  return {
    isNotMe: user && userPage.user && userPage.user.id !== user.id,
    userPage
  }
}

class UserPage extends Component {
  render() {
    const { isNotMe, userPage } = this.props
    const { user, postCount, following, followers } = userPage
    if (user != null) {
      return (
        <div>
          <ul>
            {
              isNotMe
                ? <FollowButton user={user} />
                : null
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

export default connect(mapStateToProps)(UserPage)
