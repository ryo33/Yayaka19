import React, { Component } from 'react'
import { connect } from 'react-redux'
import Linkify from 'react-linkify'

import { Card, Icon, Segment, Button } from 'semantic-ui-react'

import { userFormPage } from '../pages.js'
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
  openNewPostDialog, updatePostAddress,
  userFormPageAction: name => userFormPage.action({name})
}

class UserPage extends Component {
  constructor(props) {
    super(props)
    this.handleSendTo = this.handleSendTo.bind(this)
    this.handleClickEdit = this.handleClickEdit.bind(this)
  }

  handleSendTo() {
    const { userPage: { user }, openNewPostDialog, updatePostAddress } = this.props
    openNewPostDialog()
    updatePostAddress(user.name)
  }

  handleClickEdit() {
    const { params, userFormPageAction } = this.props
    userFormPageAction(params.name)
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
                {user.display} {isNotMe ? (
                  <FollowButton user={user} />
                ) : (
                  <Button onClick={this.handleClickEdit}>
                    <Icon name='edit' />
                    Edit
                  </Button>
                )}
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
                {isNotMe ? (
                  <div>
                    <Button primary onClick={this.handleSendTo}>
                      <Icon name='send' />
                      Send to
                    </Button>
                  </div>
                ) : null}
              </Card.Description>
            </Card.Content>
            {user.bio && user.bio.length >= 1 ? (
              <Card.Content>
                <pre>
                  <Linkify properties={{target: '_blank'}}>
                    {user.bio}
                  </Linkify>
                </pre>
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
