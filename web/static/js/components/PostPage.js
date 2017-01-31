import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Segment } from 'semantic-ui-react'

import { postPageSelector } from '../selectors.js'
import Post from './Post.js'

const mapStateToProps = state => {
  const postPage = postPageSelector(state)
  return {
    postPage
  }
}

const PostPage = ({ postPage: { post }}) => (
  post ? (
    <Segment style={{marginBottom: '10px'}}>
      <Post post={post} />
    </Segment>
  ) : null
)

export default connect(mapStateToProps)(PostPage)
