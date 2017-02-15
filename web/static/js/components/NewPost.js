import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Header, Segment, Button, Form, Label, Icon } from 'semantic-ui-react'

import { submitPost, updatePostAddress } from '../actions/index.js'
import { newPostPageSelector, userSelector } from '../selectors.js'
import Post from './Post.js'

const mapStateToProps = state => {
  return {
    user: userSelector(state),
    ...newPostPageSelector(state)
  }
}

const actionCreators = {
  submitPost,
  updatePostAddress
}

class NewPost extends Component {
  constructor(props) {
    super(props)
    this.handleChangeText = this.handleChangeText.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.submit = this.submit.bind(this)
    this.handleRemoveAddress = this.handleRemoveAddress.bind(this)
    this.state = {
      text: '',
      addressEnabled: false
    }
  }

  componentWillMount() {
    const { top, text } = this.props
    if (top) {
      this.setState({text})
    }
  }

  componentWillReceiveProps(nextProps) {
    const { top, text } = this.props
    if (top && text !== nextProps.text) {
      this.setState({text: nextProps.text})
    }
  }

  handleRemoveAddress() {
    const { updatePostAddress } = this.props
    updatePostAddress('')
  }

  reset() {
    this.setState({text: ''})
    updatePostAddress('')
  }

  submit(e) {
    e.preventDefault()
    const { top, post, address, reply, allowEmpty = false, submitPost, onSubmitHandler } = this.props
    const { text } = this.state
    if (allowEmpty || text.length >= 1) {
      const replyAddress = reply ? reply.user.name : ''
      const finalAddress = top ? address : replyAddress
      const postID = post ? post.id : null
      submitPost(text, finalAddress, postID)
      this.reset()
      if (onSubmitHandler) {
        onSubmitHandler()
      }
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

  render() {
    const { post, user, address, postAddresses, allowEmpty = false, rows = 6 } = this.props
    const { text } = this.state
    const { addressEnabled } = this.state
    return (
      <Segment.Group>
        <Segment>
          <Header>New Post</Header>
          <Form onSubmit={this.submit}>
            {address.length != 0 ? (
              <Label>
                <Icon name='send' /> {address} <Icon name='delete' onClick={this.handleRemoveAddress} />
              </Label>
            ) : null}
            <Form.TextArea name='text' value={text} rows={rows} placeholder={'What\'s in your head?'}
              onChange={this.handleChangeText} onKeyDown={this.handleKeyDown} autoFocus />
            <Form.Group inline style={{marginBottom: "0px"}}>
              <Form.Button disabled={!allowEmpty && text.length == 0} primary>Submit</Form.Button>
              <Label size='large'>{user.display} @{user.name}</Label>
            </Form.Group>
          </Form>
        </Segment>
      </Segment.Group>
    )
  }
}

const component = connect(mapStateToProps, actionCreators)(NewPost)

component.PropTypes = {
  onSubmitHandler: React.PropTypes.func,
  post: React.PropTypes.object,
  reply: React.PropTypes.object,
  allowEmpty: React.PropTypes.bool,
  top: React.PropTypes.bool,
  rows: React.PropTypes.integer
}

export default component
