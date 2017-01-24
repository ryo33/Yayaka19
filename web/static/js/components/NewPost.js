import React, { Component } from 'react'
import { connect } from 'react-redux'

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
    this.openAddress = this.openAddress.bind(this)
    this.state = {
      openAddress: false
    }
  }

  openAddress() {
    this.setState({openAddress: true})
  }

  submit() {
    const { text, address, submitPost } = this.props
    if (text.length >= 1) {
      submitPost(text, address)
    }
    this.setState({openAddress: false})
  }

  handleChangeText(event) {
    const { updatePostText } = this.props
    updatePostText(event.target.value)
  }

  handleChangeAddress(event) {
    const { updatePostAddress } = this.props
    updatePostAddress(event.target.value)
  }

  renderAddress() {
    const { address } = this.props
    if (this.state.openAddress) {
      return (
        <input
          type="text"
          value={address}
          onChange={this.handleChangeAddress}
        />
      )
    } else {
      return (
        <button onClick={this.openAddress}>
          Send to someone
        </button>
      )
    }
  }

  render() {
    const { user, text } = this.props
    return (
      <div>
        {this.renderAddress()}
        <textarea
          value={text}
          onChange={this.handleChangeText}
          rows={7}
          autoFocus
        >
        </textarea>
        <button
          className="submit"
          onClick={this.submit}
          disabled={text.length == 0}
        >Submit</button>
        <h2>Preview</h2>
        <Post
          post={{ user, text }}
          onClickUser={() => {}}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(NewPost)
