import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Header, Segment, Button, Form } from 'semantic-ui-react'

import { submitPost, updatePostText, updatePostAddress } from '../actions.js'
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
  updatePostText,
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
      addressEnabled: false
    }
  }

  toggleAddress() {
    const { addressEnabled } = this.state
    this.setState({addressEnabled: !addressEnabled})
    if (addressEnabled) {
      updatePostAddress('')
    }
  }

  submit(e) {
    e.preventDefault()
    const { text, address, submitPost } = this.props
    if (text.length >= 1) {
      submitPost(text, address)
    }
    this.setState({addressEnabled: false})
  }

  handleChangeText(event) {
    const { updatePostText } = this.props
    updatePostText(event.target.value)
  }

  handleChangeAddress(event) {
    const { updatePostAddress } = this.props
    updatePostAddress(event.target.value)
  }

  render() {
    const { user, text, address, postAddresses } = this.props
    const { addressEnabled } = this.state
    return (
      <Segment.Group>
        <Segment>
          <Header>New Post</Header>
          <Segment>
            <Form onSubmit={this.submit}>
              <Form.Group inline>
                <Form.Checkbox name='sendto' checked={addressEnabled} onChange={this.toggleAddress}
                  label='Send to' />
                <Form.Input name='address' value={address} onChange={this.handleChangeAddress}
                  disabled={!addressEnabled} inline placeholder='Name' />
              </Form.Group>
              <Form.TextArea name='text' value={text} onChange={this.handleChangeText}
                label='Text' placeholder={'What\'s in your head?'} rows='6' autoFocus />
              <Form.Button disabled={text.length == 0} primary>Submit</Form.Button>
            </Form>
          </Segment>
        </Segment>
        <Segment>
          <Header>Preview</Header>
          <Segment>
            <Post
              favButton={false}
              post={{ user, text, post_addresses: postAddresses }}
              onClickUser={() => {}}
            />
          </Segment>
        </Segment>
      </Segment.Group>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(NewPost)
