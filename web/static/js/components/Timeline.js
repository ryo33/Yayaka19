import React from 'react'
import { connect } from 'react-redux'

import { Segment, Header, Button } from 'semantic-ui-react'

import { loadNewPosts } from '../actions.js'
import { timelineSelector, userSelector } from '../selectors.js'
import { userPage } from '../pages.js'

import PostList from './PostList.js'
import ReloadButton from './ReloadButton.js'

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
  loadNewPosts
}

const Timeline = ({ posts, newPosts, userPageAction, loadNewPosts, myNewPostsCount }) => (
  <div>
    <Segment vertical>
      <Header>Timeline</Header>
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
      posts={posts}
      onClickUser={userPageAction}
    />
    <Segment vertical>
      <ReloadButton />
    </Segment>
  </div>
)

export default connect(mapStateToProps, actionCreators)(Timeline)
