import React, { Component } from 'react'
import { connect } from 'react-redux'
import Linkify from 'react-linkify'

import { Card, Icon, Segment, Button, Dimmer, Loader } from 'semantic-ui-react'

import { userFormPage } from '../pages.js'
import { openNewPostDialog, updatePostAddress } from '../actions.js'
import { userSelector, userPageSelector, followingSelector } from '../selectors.js'
import FollowButton from './FollowButton.js'

const mapStateToProps = state => {
  const user = userSelector(state)
  const userPage = userPageSelector(state)
  return {
    isMe: userPage.user && userPage.user.id === user.id,
    isNotMe: userPage.user && userPage.user.id !== user.id,
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
    const { isMe, isNotMe, userPage } = this.props
    const { user, postCount, following, followers } = userPage
    if (user != null) {
      return (
        <Segment.Group>
          <Segment>
            <Card>
              <Card.Content>
                <Card.Header>
                  {user.display} {isNotMe ? (
                    <FollowButton user={user} />
                  ) : null} {isMe ? (
                    <Button size='tiny' onClick={this.handleClickEdit}>
                      <Icon name='edit' />
                      Edit
                    </Button>
                  ) : null}
                </Card.Header>
                <Card.Meta>
                  @{user.name}
                  <span>
                    <Icon name='write' />
                    {postCount} Posts
                  </span>
                </Card.Meta>
                <Card.Description>
                  <p>
                    <Icon name='user' />
                    {following} Following
                  </p>
                  <p>
                    <Icon name='user' />
                    {followers} Followers
                  </p>
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
            </Card>
          </Segment>
          <Segment>
            {user.bio && user.bio.length >= 1 ? (
              <Card.Content>
                <pre>
                  <Linkify properties={{target: '_blank'}}>
                    {user.bio}
                  </Linkify>
                </pre>
              </Card.Content>
            ) : null}
          </Segment>
        </Segment.Group>
      )
    } else {
      return (
        <Segment>
          <Loader active inline='centered'/>
        </Segment>
      )
    }
  }
}

export default connect(mapStateToProps, actionCreators)(UserPage)
