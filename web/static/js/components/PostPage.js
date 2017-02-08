import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Segment, Header, Button } from 'semantic-ui-react'

import { postPageSelector } from '../selectors.js'
import { requestContexts } from '../actions.js'
import Post from './Post.js'
import PostList from './PostList.js'

const mapStateToProps = state => {
  const postPage = postPageSelector(state)
  return {
    postPage
  }
}

const actionCreators = {
  requestContexts
}

class PostPage extends Component {
  constructor(props) {
    super(props)
    this.handleRequestContexts = this.handleRequestContexts.bind(this)
  }

  handleRequestContexts() {
    const { requestContexts, postPage: { post }} = this.props
    requestContexts(post.id)
  }

  render() {
    const {
      postPage: { post, isLoadingContexts, contexts }
    } = this.props
    if (post) {
      return (
        <Segment.Group>
          <Segment>
            <Post post={post} />
          </Segment>
          <Segment>
            <Header>Contexts</Header>
            {contexts ? (
              <PostList posts={contexts} />
            ) : (
              <Button onClick={this.handleRequestContexts}>
                Load Contexts
              </Button>
            )}
          </Segment>
        </Segment.Group>
      )
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps, actionCreators)(PostPage)
