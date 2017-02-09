import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Form, Segment, Header, Button, Label, Dropdown, Icon } from 'semantic-ui-react'

import { submitOnlinePost, openNewPostDialog, updatePostText } from '../actions.js'
import { onlinePostsSelector, userSelector, followersSelector } from '../selectors.js'
import Post from './Post.js'
import { title } from '../global.js'
import { compareInsertedAtDesc } from '../utils.js'

const DEFAULT_CHANNEL = `@@/${title}/DEFAULT_CHANNEL`

function isDefaultChannel(channel) {
  return channel == null || channel === DEFAULT_CHANNEL
}

function getChannelsFromPosts(posts) {
  const channelsObj = {}
  posts.forEach(({ channel, user, inserted_at }) => {
    if (!isDefaultChannel(channel)) {
      if (channelsObj[channel] == null) {
        channelsObj[channel] = inserted_at
      }
    }
  }, {})
  return Object.keys(channelsObj).map(channel => (
    {name: channel, inserted_at: channelsObj[channel]}
  )).sort(compareInsertedAtDesc)
}

function filterPosts(posts, channel) {
  if (isDefaultChannel(channel)) {
    return posts
  } else {
    return posts.filter(post => post.channel === channel)
  }
}

const mapStateToProps = state => {
  const { posts } = onlinePostsSelector(state)
  const channels = getChannelsFromPosts(posts)
  return {
    posts, channels,
    followers: followersSelector(state),
    user: userSelector(state)
  }
}

const actionCreators = {
  submitOnlinePost,
  openNewPostDialog,
  updatePostText
}

class OnlinePosts extends Component {
  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
    this.handleChangeText = this.handleChangeText.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleChangeChannel = this.handleChangeChannel.bind(this)
    this.state = {
      text: '',
      channel: DEFAULT_CHANNEL
    }
  }

  reset() {
    this.setState({
      text: ''
    })
  }

  submit(e) {
    e.preventDefault()
    const { submitOnlinePost } = this.props
    const { text, channel } = this.state
    if (text.length >= 1) {
      submitOnlinePost({text, channel})
      this.reset()
    }
  }

  handleChangeText(event) {
    this.setState({text: event.target.value})
  }

  handleKeyDown(event) {
    if (event.keyCode === 13 && (event.ctrlKey || event.metaKey) && !(event.ctrlKey && event.metaKey)) {
      this.submit(event)
    }
  }

  handleClickWrite(post) {
    const { openNewPostDialog, updatePostText } = this.props
    updatePostText(post.text)
    openNewPostDialog()
  }

  changeChannel(value) {
    this.setState({
      channel: value
    })
  }

  handleChangeChannel(e, { value }) {
    this.changeChannel(value)
  }

  renderChannels() {
    const { channels } = this.props
    const { channel } = this.state
    const otherChannels = channels
      .filter(c => c.name !== channel)
      .map(({ name }) => ({key: name, text: name, value: name}))
    const options = [
      {key: DEFAULT_CHANNEL, text: 'All', value: DEFAULT_CHANNEL},
      ...otherChannels
    ]
    if (!isDefaultChannel(channel)) {
      options.unshift({key: channel, text: channel, value: channel})
    }
    return (
      <Dropdown
        options={options}
        search
        selection
        fluid
        allowAdditions
        value={channel}
        onAddItem={this.handleChangeChannel}
        onChange={this.handleChangeChannel}
      />
    )
  }

  render() {
    const { posts, user, followers } = this.props
    const { text, channel } = this.state
    const filteredPosts = filterPosts(posts, channel)
    return (
      <div>
        <Segment vertical>
          <Header>Online Bar</Header>
        </Segment>
        <Segment vertical>
          <Form onSubmit={this.submit}>
            <Form.TextArea name='text' value={text} rows='3' placeholder={'What\'s in your head?'}
              onChange={this.handleChangeText} onKeyDown={this.handleKeyDown} autoFocus />
            <Form.Group inline style={{marginBottom: "0px"}}>
              <Form.Button disabled={text.length == 0} primary>Submit</Form.Button>
              <Label size='large'>{user.display} @{user.name}</Label>
            </Form.Group>
          </Form>
          {this.renderChannels()}
        </Segment>
        {filteredPosts.length == 0 ? (
          <Segment vertical>
            <p>Nothing to show</p>
          </Segment>
        ) : null}
        {filteredPosts.map(post => (
          <Post
            key={post.id}
            postLink={false}
            followButton={false}
            actions={false}
            attributeIcon={followers.includes(post.user.id) ? 'exchange' : null}
            prefix={(
              <span>
                {!isDefaultChannel(post.channel) ? (
                  <Button size='mini' onClick={() => this.changeChannel(post.channel)}>
                    <Icon name='hashtag' />
                    {post.channel}
                  </Button>
                ) : null}
                {post.isOnlinePost && post.user.name == user.name ? (
                  <Button icon='clone' size='mini' onClick={() => this.handleClickWrite(post)} />
                ) : null}
              </span>
            )}
            post={post}
          />
        ))}
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(OnlinePosts)
