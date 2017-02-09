import React from 'react'
import { connect } from 'react-redux'

import { Comment, Segment } from 'semantic-ui-react'

import { userSelector } from '../selectors.js'
import Post from './Post.js'

const PostList = ({ followButton = true, posts, children }) => (
  <div>
    {
      posts.map(post => (
        <Segment key={post.id} vertical>
          <Post
            list
            followButton={followButton}
            post={post}
          />
        </Segment>
      ))
    }
    {children}
  </div>
)

PostList.propTypes = {
  followButton: React.PropTypes.bool,
  posts: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.number.isRequired,
    user: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      display: React.PropTypes.string.isRequired
    }),
    text: React.PropTypes.string
  })).isRequired,
  children: React.PropTypes.node
}

export default PostList
