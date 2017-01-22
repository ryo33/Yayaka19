import React from 'react'
import { connect } from 'react-redux'

import { publicTimelinePostsSelector } from '../selectors.js'
import { userPage } from '../pages.js'

import PostList from './PostList.js'

const mapStateToProps = state => {
  return {
    posts: publicTimelinePostsSelector(state)
  }
}

const actionCreators = {
  userPageAction: name => userPage.action({name})
}

const PublicTimeline = ({ posts, userPageAction }) => (
  <div>
    <PostList
      posts={posts}
      onClickUser={userPageAction}
    />
  </div>
)

export default connect(mapStateToProps, actionCreators)(PublicTimeline)
