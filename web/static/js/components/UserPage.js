import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, Icon } from 'semantic-ui-react'

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
          {
            isNotMe
              ? <FollowButton user={user} />
              : null
          }
          <Card>
            <Card.Content>
              <Card.Header>
                {user.display}
              </Card.Header>
              <Card.Meta>
                @{user.name} {postCount} Posts
              </Card.Meta>
              <Card.Content extra>
                <span>
                  <Icon name='user' />
                  {following} Following
                </span>
                <span>
                  <Icon name='user' />
                  {followers} Followers
                </span>
              </Card.Content>
            </Card.Content>
          </Card>
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
