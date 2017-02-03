import React from 'react'
import { connect } from 'react-redux'

import { Segment, Header, Button, Rail, Icon } from 'semantic-ui-react'

import { loadNewPosts, requestTimeline } from '../actions.js'
import { timelineSelector, userSelector } from '../selectors.js'
import { publicTimeline } from '../pages.js'

import PostList from './PostList.js'

const mapStateToProps = state => {
  const { posts, newPosts } = timelineSelector(state)
  const user = userSelector(state)
  const myNewPostsCount = newPosts.filter(posts => posts.user.id == user.id).length
  return {
    user, posts, newPosts, myNewPostsCount
  }
}

const actionCreators = {
  publicTimelineAction: () => publicTimeline.action(),
  loadNewPosts,
  requestTimeline
}

const Timeline = ({
  user, posts, newPosts, publicTimelineAction,
  loadNewPosts, myNewPostsCount, requestTimeline
}) => (
  <div>
    <Segment vertical>
      <Header>{user.display}'s Timeline</Header>
      <Rail internal position='right'>
        <Button floated='right' icon='refresh' onClick={requestTimeline}>
        </Button>
      </Rail>
    </Segment>
    {newPosts.length != 0 ? (
      <Segment vertical>
        <Button fluid basic color='blue' onClick={loadNewPosts}>
          {newPosts.length} new post{
            newPosts.length == 1 ? '' : 's'
          } { myNewPostsCount != 0 ? (
            `(${myNewPostsCount} of them ${
              myNewPostsCount == 1 ? 'is' : 'are'
            } your post${
              myNewPostsCount == 1 ? '' : 's'
            })`
          ) : null }
        </Button>
      </Segment>
    ) : null}
    {posts.length == 0 ? (
      <Segment vertical>
        <Button primary onClick={publicTimelineAction}>
          Go public timeline and follow users
        </Button>
      </Segment>
    ) : null}
    <PostList
      followButton={false}
      posts={posts}
    />
  </div>
)

export default connect(mapStateToProps, actionCreators)(Timeline)
