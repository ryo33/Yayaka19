import React, { Component } from 'react'
import { connect } from 'react-redux'
import Linkify from 'react-linkify'

import { Card, Icon, Segment, Button, Dimmer, Loader, Header } from 'semantic-ui-react'

import {
  userFormPage, followersPage, followingPage,
  mysteriesPage, openedMysteriesPage
} from '../pages.js'
import { openNewPostDialog, updatePostAddress, requestMoreUserPosts } from '../actions/index.js'
import { userSelector, userPageSelector, followingSelector } from '../selectors.js'
import { isRemoteHost } from '../utils.js'
import UserID from './UserID.js'
import FollowButton from './FollowButton.js'
import PostList from './PostList.js'

const mapStateToProps = state => {
  const user = userSelector(state)
  const userPage = userPageSelector(state)
  return {
    isMe: userPage.user && !isRemoteHost(userPage.user.host) && userPage.user.id === user.id,
    isNotMe: userPage.user && userPage.user.id !== user.id,
    userPage
  }
}

const actionCreators = {
  openNewPostDialog, updatePostAddress, requestMoreUserPosts,
  userFormPageAction: name => userFormPage.action({name}),
  followersPageAction: name => followersPage.action({name}),
  followingPageAction: name => followingPage.action({name}),
  mysteriesPageAction: name => mysteriesPage.action({name}),
  openedMysteriesPageAction: name => openedMysteriesPage.action({name})
}

const LocalButton = ({ user, ...props }) => {
  if (user && user.host) {
    const { onClick, ...newProps } = props
    return (
      <Button {...newProps} />
    )
  } else {
    return (
      <Button {...props} />
    )
  }
}

class UserPage extends Component {
  constructor(props) {
    super(props)
    this.handleSendTo = this.handleSendTo.bind(this)
    this.handleClickEdit = this.handleClickEdit.bind(this)
    this.handleLoadMorePosts = this.handleLoadMorePosts.bind(this)
    this.handleClickFollowers = this.handleClickFollowers.bind(this)
    this.handleClickFollowing = this.handleClickFollowing.bind(this)
    this.handleClickMysteries = this.handleClickMysteries.bind(this)
    this.handleClickOpenedMysteries = this.handleClickOpenedMysteries.bind(this)
  }

  handleSendTo() {
    const { userPage: { user }, openNewPostDialog, updatePostAddress } = this.props
    openNewPostDialog()
    updatePostAddress(user)
  }

  handleClickEdit() {
    const { params, userFormPageAction } = this.props
    userFormPageAction(params.name)
  }

  handleLoadMorePosts() {
    const { requestMoreUserPosts, userPage: { user, posts }} = this.props
    if (posts.length != 0) {
      requestMoreUserPosts(user.name, posts[posts.length - 1].id)
    }
  }

  handleClickFollowers() {
    const { followersPageAction, userPage: { user }} = this.props
    followersPageAction(user.name)
  }

  handleClickFollowing() {
    const { followingPageAction, userPage: { user }} = this.props
    followingPageAction(user.name)
  }

  handleClickMysteries() {
    const { mysteriesPageAction, userPage: { user }} = this.props
    mysteriesPageAction(user.name)
  }

  handleClickOpenedMysteries() {
    const { openedMysteriesPageAction, userPage: { user }} = this.props
    openedMysteriesPageAction(user.name)
  }

  render() {
    const { isMe, isNotMe, userPage } = this.props
    const {
      user, postCount, following, followers, mysteries, openedMysteries,
      posts, isLoadingMorePosts
    } = userPage
    const remote = user && isRemoteHost(user.host)
    if (user != null) {
      return (
        <Segment.Group>
          <Segment>
            <Card fluid>
              <Card.Content>
                <Card.Header>
                  {user.display} {isNotMe ? (
                    <FollowButton user={user} large />
                  ) : null} {isMe ? (
                    <Button size='tiny' onClick={this.handleClickEdit}>
                      <Icon name='edit' />
                      Edit
                    </Button>
                  ) : null}
                </Card.Header>
                <Card.Meta>
                  <UserID user={user} />
                  <span>
                    <Icon name='write' />
                    {postCount} Posts
                  </span>
                </Card.Meta>
                <Card.Description>
                  {remote ? (
                    <Segment basic>
                      <Button as='a'
                        href={user.path ? `https://${user.host}${user.path}` : null}
                        fluid
                        primary
                      >
                        <Icon name='external' />
                        {`Go to ${user.host}`}
                      </Button>
                    </Segment>
                  ) : null}
                  <LocalButton
                    user={user}
                    content='Following'
                    icon='user'
                    label={{as: 'a', basic: true, content: following}}
                    labelPosition='right'
                    onClick={this.handleClickFollowing}
                  />
                  <LocalButton
                    user={user}
                    content='Followers'
                    icon='user'
                    label={{as: 'a', basic: true, content: followers}}
                    labelPosition='right'
                    onClick={this.handleClickFollowers}
                  />
                  <LocalButton
                    user={user}
                    content='Opened Mysteries'
                    icon='bomb'
                    label={{as: 'a', basic: true, content: openedMysteries}}
                    labelPosition='right'
                    onClick={this.handleClickOpenedMysteries}
                  />
                  <LocalButton
                    user={user}
                    content='Mysteries'
                    icon='bomb'
                    label={{as: 'a', basic: true, content: mysteries}}
                    labelPosition='right'
                    onClick={this.handleClickMysteries}
                  />
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
          {user.bio && user.bio.length >= 1 ? (
            <Segment>
              <Header>Bio</Header>
              <pre>
                <Linkify properties={{target: '_blank'}}>
                  {user.bio}
                </Linkify>
              </pre>
            </Segment>
          ) : null}
          <Segment>
            <Header>Recent Posts</Header>
            <PostList posts={posts}>
              {!remote ? (
                <Segment vertical>
                  <Dimmer active={isLoadingMorePosts} inverted>
                    <Loader inverted />
                  </Dimmer>
                  <Button primary fluid onClick={this.handleLoadMorePosts}>
                    Load More
                  </Button>
                </Segment>
              ) : null}
            </PostList>
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
