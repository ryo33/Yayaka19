import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Grid, Header, Segment, Button, Form, Label, Icon } from 'semantic-ui-react'

import { submitPost, updatePostAddress } from '../actions.js'
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
    const { post, address, submitPost, onSubmitHandler } = this.props
    const { text } = this.state
    if (text.length >= 1) {
      if (post) {
        submitPost(text, '', post.id)
      } else {
        submitPost(text, address, null)
      }
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
    const { post, user, address, postAddresses } = this.props
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
            <Form.TextArea name='text' value={text} rows='6' placeholder={'What\'s in your head?'}
              onChange={this.handleChangeText} onKeyDown={this.handleKeyDown} autoFocus />
            <Form.Button disabled={text.length == 0} primary>Submit</Form.Button>
          </Form>
        </Segment>
      </Segment.Group>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(NewPost)
