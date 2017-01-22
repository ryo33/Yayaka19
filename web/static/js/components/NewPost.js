import React, { Component } from 'react'
import { connect } from 'react-redux'

import { submitPost, updatePostText } from '../actions.js'
import { newPostPageSelector } from '../selectors.js'

const mapStateToProps = state => {
  return newPostPageSelector(state)
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
    const { text } = this.props
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
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(NewPost)
