import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Segment, Header, Button, Rail, Icon, Dimmer, Loader, Table } from 'semantic-ui-react'

import { loadNewPosts, requestTimeline, requestMoreTimeline } from '../actions/index.js'
import { timelineSelector, userSelector } from '../selectors.js'
import { publicTimeline } from '../pages.js'

import PostList from './PostList.js'

const mapStateToProps = state => {
  const {
    posts, remotes, newPosts, isLoadingTimeline, isLoadingMore
  } = timelineSelector(state)
  const user = userSelector(state)
  const myNewPostsCount = newPosts.filter(posts => posts.user.id == user.id).length
  return {
    user, posts, remotes, newPosts, myNewPostsCount,
    isLoadingTimeline, isLoadingMore
  }
}

const actionCreators = {
  publicTimelineAction: () => publicTimeline.action(),
  loadNewPosts,
  requestTimeline,
  requestMoreTimeline
}

class Timeline extends Component {
  constructor(props) {
    super(props)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleLoadMore = this.handleLoadMore.bind(this)
    this.handleLoadPosts = this.handleLoadPosts.bind(this)
  }

  handleRefresh() {
    const { requestTimeline } = this.props
    requestTimeline()
  }

  handleLoadMore() {
    const { posts, requestMoreTimeline } = this.props
    const oldestPost = posts[posts.length - 1]
    requestMoreTimeline(oldestPost.id)
  }

  handleLoadPosts() {
    const { loadNewPosts, newPosts } = this.props
    loadNewPosts(newPosts)
  }

  handlePublic() {
    const { publicTimelineAction } = this.props
    publicTimelineAction()
  }

  renderLoadMore() {
    const { isLoadingMore } = this.props
    if (isLoadingMore) {
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      )
    } else {
      return (
        <Button primary fluid onClick={this.handleLoadMore}>
          Load More
        </Button>
      )
    }
  }

  render() {
    const {
      user, posts, remotes, newPosts, myNewPostsCount,
      isLoadingTimeline, isLoadingMore
    } = this.props
    const list = [0, 0, 0, 0]
    Object.keys(remotes).forEach(host => {
      const status = remotes[host]
      if (status == 'ok') {
        list[0] ++
      } else if (status == 'error') {
        list[1] ++
      } else if (status == 'timeout') {
        list[2] ++
      } else {
        list[3] ++
      }
    })
    const [ok, error, timeout, loading] = list
    return (
      <Dimmer.Dimmable>
        <Dimmer active={isLoadingTimeline} inverted>
          <Loader inverted />
        </Dimmer>
        <Segment vertical>
          <Header>{user.display}'s Timeline</Header>
          {loading != 0 ? (
            <Table>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Loaded</Table.Cell>
                  <Table.Cell>{ok}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Error</Table.Cell>
                  <Table.Cell>{error}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Timeout</Table.Cell>
                  <Table.Cell>{timeout}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Loading</Table.Cell>
                  <Table.Cell>{loading}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          ) : null}
          <Rail internal position='right'>
            <Button floated='right' icon='refresh' onClick={this.handleRefresh}>
            </Button>
          </Rail>
        </Segment>
        {newPosts.length != 0 ? (
          <Segment vertical>
            <Button fluid basic color='blue' onClick={this.handleLoadPosts}>
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
            <Button primary onClick={this.handlePublic}>
              Go public timeline and follow users
            </Button>
          </Segment>
        ) : null}
        <PostList
          followButton={false}
          posts={posts}
        >
          <Segment vertical>
            <Dimmer active={isLoadingMore} inverted>
              <Loader inverted />
            </Dimmer>
            <Button primary fluid onClick={this.handleLoadMore}>
              Load More
            </Button>
          </Segment>
        </PostList>
      </Dimmer.Dimmable>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(Timeline)
