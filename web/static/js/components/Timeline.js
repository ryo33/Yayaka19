import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  Segment, Header, Button, Icon, Dimmer, Loader, Table, Label
} from 'semantic-ui-react'

import {
  loadNewPosts, requestTimeline, requestMoreTimeline, requestRemoteTimeline
} from '../actions/index.js'
import { timelineSelector, userSelector } from '../selectors.js'
import { publicTimeline } from '../pages.js'
import { isRemoteHost, getPostsFooters } from '../utils.js'
import PostList from './PostList.js'

const mapStateToProps = state => {
  const {
    posts, remotes, newPosts, isLoadingTimeline, isLoadingMore
  } = timelineSelector(state)
  const user = userSelector(state)
  const myNewPostsCount = newPosts.filter(posts => {
    return !isRemoteHost(posts.user.host) && posts.user.name == user.name
  }).length
  const oldestPost = posts.filter(({ host }) => !isRemoteHost(host)).slice(-1).pop()
  return {
    user, posts, remotes, newPosts, myNewPostsCount,
    isLoadingTimeline, isLoadingMore, oldestPost
  }
}

const actionCreators = {
  publicTimelineAction: () => publicTimeline.action(),
  loadNewPosts,
  requestTimeline,
  requestMoreTimeline,
  requestRemoteTimeline
}

const remoteStatusColors = {
  ok: 'green',
  error: 'red',
  timeout: 'yellow'
}

class RemotesInfo extends Component {
  constructor(props) {
    super(props)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.state = {
      open: false
    }
  }

  open() {
    this.setState({open: true})
  }

  close() {
    this.setState({open: false})
  }

  render() {
    const {
      remotes, request, ok, error, timeout, loading
    } = this.props
    const labels = (
      <span>
        {ok && (error || timeout || loading) ? (
          <Label circular color={remoteStatusColors["ok"]} content={ok} />
        ) : null}
        {error ? (
          <Label circular color={remoteStatusColors["error"]} content={error} />
        ) : null}
        {timeout ? (
          <Label circular color={remoteStatusColors["timeout"]} content={timeout} />
        ) : null}
        {loading ? (
          <Label circular color='grey' content={loading} />
        ) : null}
      </span>
    )
    if (this.state.open) {
      return (
        <div>
          <Button onClick={this.close}>
            Close
          </Button>
          {labels}
          <Table celled fixed unstackable singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Server</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Retry</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                Object.keys(remotes).sort().map(host => {
                  const remote = remotes[host]
                  const color = remoteStatusColors[remote]
                  return (
                    <Table.Row key={host}>
                      <Table.Cell>{host}</Table.Cell>
                      <Table.Cell>
                        <Label color={color} content={remote || 'loading'} />
                      </Table.Cell>
                      <Table.Cell>
                        {remote != 'ok' ? (
                          <Button onClick={() => request(host)}>
                            Retry
                          </Button>
                        ) : null}
                      </Table.Cell>
                    </Table.Row>
                  )
                })
              }
            </Table.Body>
          </Table>
        </div>
      )
    } else {
      return (
        <span>
          <Button onClick={this.open}>
            Servers
          </Button>
          {labels}
        </span>
      )
    }
  }
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
    const { oldestPost, requestMoreTimeline } = this.props
    if (oldestPost != null) {
      requestMoreTimeline(oldestPost.id)
    }
  }

  handleLoadPosts() {
    const { loadNewPosts, newPosts } = this.props
    loadNewPosts(newPosts)
  }

  handlePublic() {
    const { publicTimelineAction } = this.props
    publicTimelineAction()
  }

  render() {
    const {
      user, posts, remotes, newPosts, myNewPostsCount,
      isLoadingTimeline, isLoadingMore, requestRemoteTimeline
    } = this.props
    const footers = getPostsFooters(posts, (
      <div>
        <Dimmer active={isLoadingMore} inverted>
          <Loader inverted />
        </Dimmer>
        <Button primary fluid onClick={this.handleLoadMore}>
          Load More
        </Button>
      </div>
    ))
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
          <Button floated='right' icon='refresh' onClick={this.handleRefresh}>
          </Button>
          <RemotesInfo remotes={remotes} request={requestRemoteTimeline}
            ok={ok} error={error} timeout={timeout} loading={loading} />
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
          footers={footers}
        />
      </Dimmer.Dimmable>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(Timeline)
