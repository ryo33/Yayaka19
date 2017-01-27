import React from 'react'
import { connect } from 'react-redux'

import { Segment, Header } from 'semantic-ui-react'

import { timelinePostsSelector } from '../selectors.js'
import { userPage } from '../pages.js'

import PostList from './PostList.js'
import ReloadButton from './ReloadButton.js'

const mapStateToProps = state => {
  return {
    posts: timelinePostsSelector(state)
  }
}

const actionCreators = {
  userPageAction: name => userPage.action({name})
}

const Timeline = ({ posts, userPageAction }) => (
  <div>
    <Segment vertical>
      <Header>Timeline</Header>
      <ReloadButton />
    </Segment>
    <PostList
      posts={posts}
      onClickUser={userPageAction}
    />
    <ReloadButton />
  </div>
)

export default connect(mapStateToProps, actionCreators)(Timeline)
