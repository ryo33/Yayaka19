import React from 'react'
import { connect } from 'react-redux'

import { Segment, Message, Header } from 'semantic-ui-react'

import { signedIn } from '../global.js'
import { publicTimelinePostsSelector } from '../selectors.js'
import { userPage } from '../pages.js'

import PostList from './PostList.js'
import ReloadButton from './ReloadButton.js'

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
    { signedIn ? null : (
      <Message>
        <Message.Header>
          Welcome!
        </Message.Header>
        <p>
          This is a social networking service that randomly choose posts to display on the timeline.<br />
          You need to login to post, follow users, use personal timeline, favorite posts, etc.
        </p>
      </Message>
    )}
    <Segment vertical>
      <Header>Public Timeline</Header>
      <ReloadButton />
    </Segment>
    <PostList
      posts={posts}
      onClickUser={userPageAction}
    />
    <ReloadButton />
  </div>
)

export default connect(mapStateToProps, actionCreators)(PublicTimeline)
