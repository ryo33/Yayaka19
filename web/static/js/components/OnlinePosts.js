import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Form, Segment, Header, Button, Label } from 'semantic-ui-react'

import { submitOnlinePost, openNewPostDialog, updatePostText } from '../actions.js'
import { onlinePostsSelector, userSelector, followersSelector } from '../selectors.js'
import Post from './Post.js'

const mapStateToProps = state => {
  const { posts } = onlinePostsSelector(state)
  return {
    posts,
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
    const { submitOnlinePost } = this.props
    const { text } = this.state
    if (text.length >= 1) {
      submitOnlinePost({text})
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

  render() {
    const { posts, user, followers } = this.props
    const { text } = this.state
    return (
      <div>
        <Segment vertical>
          <Header>Online</Header>
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
        </Segment>
        {posts.length == 0 ? (
          <Segment vertical>
            <p>Nothing to show</p>
          </Segment>
        ) : null}
        {posts.map(post => (
          <Post
            key={post.id}
            postLink={false}
            followButton={false}
            favButton={false}
            replyButton={false}
            attributeIcon={followers.includes(post.user.id) ? 'exchange' : null}
            prefix={post.user.name == user.name ? (
              <Button icon='clone' size='mini' onClick={() => this.handleClickWrite(post)} />
            ) : null}
            post={post}
          />
        ))}
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(OnlinePosts)
