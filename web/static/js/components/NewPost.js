import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Grid, Header, Segment, Button, Form } from 'semantic-ui-react'

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
    this.handleChangeAddress = this.handleChangeAddress.bind(this)
    this.submit = this.submit.bind(this)
    this.toggleAddress = this.toggleAddress.bind(this)
    this.state = {
      text: '',
      addressEnabled: false
    }
  }

  toggleAddress() {
    const { updatePostAddress } = this.props
    const { addressEnabled } = this.state
    this.setState({addressEnabled: !addressEnabled})
    if (addressEnabled) {
      updatePostAddress('')
    }
  }

  reset() {
    updatePostAddress('')
    this.setState({text: '', addressEnabled: false})
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

  handleChangeAddress(event) {
    const { updatePostAddress } = this.props
    updatePostAddress(event.target.value)
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
            { post ? null : (
              <Form.Group inline>
                <Form.Checkbox name='sendto' checked={addressEnabled} onChange={this.toggleAddress}
                  label='Send to' />
                <Form.Input name='address' value={address} onChange={this.handleChangeAddress}
                  disabled={!addressEnabled} inline placeholder='Name' />
              </Form.Group>
            ) }
            <Form.TextArea name='text' value={text} onChange={this.handleChangeText}
              label='Text' placeholder={'What\'s in your head?'} rows='6' autoFocus />
            <Form.Button disabled={text.length == 0} primary>Submit</Form.Button>
          </Form>
        </Segment>
      </Segment.Group>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(NewPost)
