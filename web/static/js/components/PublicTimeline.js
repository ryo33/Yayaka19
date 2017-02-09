import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Segment, Message, Header, Button, Label, Dimmer, Loader } from 'semantic-ui-react'

import { signedIn } from '../global.js'
import { userSelector, publicTimelineSelector } from '../selectors.js'
import { requestPublicTimeline } from '../actions.js'

import PostList from './PostList.js'

const mapStateToProps = state => {
  const {
    posts, isLoadingPublicTimeline
  } = publicTimelineSelector(state)
  return {
    user: userSelector(state),
    posts, isLoadingPublicTimeline
  }
}

const actionCreators = {
  requestPublicTimeline
}

class PublicTimeline extends Component {
  constructor(props) {
    super(props)
    this.handleReload = this.handleReload.bind(this)
  }

  handleReload() {
    const { requestPublicTimeline } = this.props
    requestPublicTimeline()
  }

  render() {
    const {
      posts, requestPublicTimeline, user, isLoadingPublicTimeline
    } = this.props
    return (
      <div>
        <Dimmer active={isLoadingPublicTimeline} inverted>
          <Loader inverted />
        </Dimmer>
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
          <Button primary onClick={requestPublicTimeline}>Reload</Button>
          <Label size='large'>{user.display} @{user.name}</Label>
        </Segment>
        <PostList
          posts={posts}
        />
        <Segment vertical>
          <Button onClick={requestPublicTimeline}>Reload</Button>
        </Segment>
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(PublicTimeline)
