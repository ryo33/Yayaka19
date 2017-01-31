import React from 'react'
import { connect } from 'react-redux'

import { Segment, Message, Header, Button } from 'semantic-ui-react'

import { signedIn } from '../global.js'
import { publicTimelinePostsSelector } from '../selectors.js'
import { requestPublicTimeline } from '../actions.js'

import PostList from './PostList.js'

const mapStateToProps = state => {
  return {
    posts: publicTimelinePostsSelector(state)
  }
}

const actionCreators = {
  requestPublicTimeline
}

const PublicTimeline = ({ posts, requestPublicTimeline }) => (
  <div>
    { signedIn ? null : (
      <Message>
        <Message.Header>
          Welcome!
        </Message.Header>
        <p>
          This is a social networking service.<br />
          You need to login to post, follow users, use personal timeline, favorite posts, etc.
        </p>
      </Message>
    )}
    <Segment vertical>
      <Header>Public Timeline</Header>
      <Button onClick={requestPublicTimeline}>Reload</Button>
    </Segment>
    <PostList
      posts={posts}
    />
    <Segment vertical>
      <Button onClick={requestPublicTimeline}>Reload</Button>
    </Segment>
  </div>
)

export default connect(mapStateToProps, actionCreators)(PublicTimeline)
