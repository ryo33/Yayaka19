import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, Icon, Segment, Button } from 'semantic-ui-react'

import { openNewPostDialog, updatePostAddress } from '../actions.js'
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

const actionCreators = {
  openNewPostDialog, updatePostAddress
}

class UserPage extends Component {
  constructor(props) {
    super(props)
    this.handleSendTo = this.handleSendTo.bind(this)
  }

  handleSendTo() {
    const { userPage: { user }, openNewPostDialog, updatePostAddress } = this.props
    openNewPostDialog()
    updatePostAddress(user.name)
  }

  render() {
    const { isNotMe, userPage } = this.props
    const { user, postCount, following, followers } = userPage
    if (user != null) {
      return (
        <Segment>
          <Card>
            <Card.Content>
              <Card.Header>
                {user.display} {isNotMe ? <FollowButton user={user} /> : null}
              </Card.Header>
              <Card.Meta>
                @{user.name} {postCount} Posts
              </Card.Meta>
              <Card.Description>
              <span>
                <Icon name='user' />
                {following} Following
              </span>
              <span>
                <Icon name='user' />
                {followers} Followers
              </span>
              </Card.Description>
            </Card.Content>
            {isNotMe ? (
              <Card.Content extra>
                <Button primary onClick={this.handleSendTo}>
                  <Icon name='send' />
                  Send to
                </Button>
              </Card.Content>
            ) : null}
          </Card>
        </Segment>
      )
    } else {
      return (
        <div>
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, actionCreators)(UserPage)
