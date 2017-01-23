import React, { Component } from 'react'
import { connect } from 'react-redux'

import { submitPost, updatePostText } from '../actions.js'
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
  updatePostText
}

class NewPost extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.submit = this.submit.bind(this)
  }

  submit() {
    const { text, submitPost } = this.props
    if (text.length >= 1) {
      submitPost(text)
    }
  }

  handleChange(event) {
    const { updatePostText } = this.props
    updatePostText(event.target.value)
  }
  render() {
    const { user, text } = this.props
    return (
      <div>
        <textarea
          value={text}
          onChange={this.handleChange}
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
