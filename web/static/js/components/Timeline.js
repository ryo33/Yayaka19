import React from 'react'
import { connect } from 'react-redux'

import { Segment, Header, Button, Rail, Icon } from 'semantic-ui-react'

import { loadNewPosts, requestTimeline } from '../actions.js'
import { timelineSelector, userSelector } from '../selectors.js'
import { userPage } from '../pages.js'

import PostList from './PostList.js'

const mapStateToProps = state => {
  const { posts, newPosts } = timelineSelector(state)
  const user = userSelector(state)
  const myNewPostsCount = newPosts.filter(posts => posts.user.id == user.id).length
  return {
    posts, newPosts, myNewPostsCount
  }
}

const actionCreators = {
  userPageAction: name => userPage.action({name}),
  loadNewPosts,
  requestTimeline
}

const Timeline = ({
  posts, newPosts, userPageAction, loadNewPosts, myNewPostsCount, requestTimeline
}) => (
  <div>
    <Segment vertical>
      <Header>Timeline</Header>
      <Rail internal position='right'>
        <Button floated='right' icon='refresh' onClick={requestTimeline}>
        </Button>
      </Rail>
    </Segment>
    { newPosts.length != 0 ? (
      <Segment vertical>
        <Button fluid basic color='blue' onClick={loadNewPosts}>
          {newPosts.length} new posts { myNewPostsCount != 0 ? (
            `(${myNewPostsCount} of them ${
              myNewPostsCount == 1 ? 'is' : 'are'
            } your post${
              myNewPostsCount == 1 ? '' : 's'
            })`
          ) : null }
        </Button>
      </Segment>
    ) : null }
    <PostList
      followButton={false}
      posts={posts}
      onClickUser={userPageAction}
    />
  </div>
)

export default connect(mapStateToProps, actionCreators)(Timeline)
