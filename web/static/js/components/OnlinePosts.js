import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Form, Segment, Header, Button, Label, Dropdown, Icon } from 'semantic-ui-react'

import {
  changeOnlineChannel, showOnlinePosts, submitOnlinePost, openNewPostDialog, updatePostText
} from '../actions.js'
import { onlinePostsSelector, userSelector, followersSelector } from '../selectors.js'
import Post from './Post.js'
import { title } from '../global.js'
import { isDefaultChannel, DEFAULT_CHANNEL } from '../utils.js'

const channelsSorter = (a, b) => {
  const l = a.count, r = b.count
  if (a.count == b.count) {
    if (isDefaultChannel(a.name)) return -1
    if (isDefaultChannel(b.name)) return 1
    return a.name < b.name ? -1 : 1 // ASC
  } else {
    return b.count - a.count // DESC
  }
}
function getChannelsFromPosts(posts, channel, channels) {
  const channelsObj = {}
  let countSum = 0
  posts.forEach(({ channel, user, inserted_at }) => {
    if (channel != null) {
      if (channelsObj[channel] == null) {
        const count = channels[channel] || 0
        channelsObj[channel] = count
        countSum += count
      }
    }
  })
  if (!isDefaultChannel(channel) && channelsObj[channel] == null) {
    // Add current channel
    channelsObj[channel] = 0
  }
  // Add default channel
  channelsObj[DEFAULT_CHANNEL] = countSum
  return Object.keys(channelsObj).map(channel => (
    {name: channel, count: channelsObj[channel]}
  )).sort(channelsSorter)
}

function filterPosts(posts, channel) {
  if (isDefaultChannel(channel)) {
    return posts
  } else {
    return posts.filter(post => post.channel === channel)
  }
}

const mapStateToProps = state => {
  const { posts, channel, channels } = onlinePostsSelector(state)
  return {
    posts, channel,
    channels: getChannelsFromPosts(posts, channel, channels),
    followers: followersSelector(state),
    user: userSelector(state)
  }
}

const actionCreators = {
  changeOnlineChannel,
  showOnlinePosts,
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
      text: ''
    }
  }

  reset() {
    this.setState({
      text: ''
    })
  }

  submit(e) {
    e.preventDefault()
    const { submitOnlinePost, channel } = this.props
    const { text } = this.state
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

  handleChangeChannel(e, { value }) {
    this.changeChannel(value)
  }

  changeChannel(value) {
    const { changeOnlineChannel } = this.props
    changeOnlineChannel(value)
  }

  showOnlinePosts(value) {
    const { showOnlinePosts } = this.props
    showOnlinePosts(value)
  }

  renderChannels() {
    const { channels, channel } = this.props
    const getText = (text, isAll) => isAll ? 'All' : `${text}`
    const options = [
      ...channels.map(({ name, count }) => {
        const isAll = isDefaultChannel(name)
        const text = getText(name, isAll)
        return {
          key: name,
          value: name,
          text: text,
          content: (
            <span>
              <Icon name={isAll ? 'bar' : 'hashtag'} />
              {text} {count >= 1 ? (
                <Label color='yellow' circular content={count} />
              ) : null}
            </span>
          )
        }
      })
    ]
    return (
      <span>
        <Dropdown
          placeholder='Choose or Add Channel'
          options={options}
          search
          selection
          allowAdditions
          value={channel}
          onAddItem={this.handleChangeChannel}
          onChange={this.handleChangeChannel}
        />
        {!isDefaultChannel(channel) ? (
          <Button icon='bar' color='orange' onClick={() => this.changeChannel(DEFAULT_CHANNEL)} />
        ) : null}
        {
          channels
            .filter(({ name, count }) => count >= 1)
            .map(({ name, count }) => {
              const isAll = isDefaultChannel(name)
              const text = getText(name, isAll)
              return (
                <Label as='a' key={name} onClick={() => this.changeChannel(name)}
                  icon={isAll ? 'bar' : 'hashtag'} content={text}
                  detail={<Label color='yellow' circular content={count} />}
                  removeIcon={<Icon name='delete' />}
                  onRemove={(e) => {
                    e.stopPropagation()
                    this.showOnlinePosts(name)
                  }}
                />
              )
            })
        }
      </span>
    )
  }

  render() {
    const { posts, user, followers, channel } = this.props
    const { text } = this.state
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
                {isDefaultChannel(channel) && !isDefaultChannel(post.channel) ? (
                  <Button size='mini' onClick={() => this.changeChannel(post.channel)}>
                    <Icon name='hashtag' />
                    {post.channel}
                  </Button>
                ) : null}
                {post.isOnlinePost && post.user.name == user.name ? (
                  <Button primary icon='clone' size='mini' onClick={() => this.handleClickWrite(post)} />
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
