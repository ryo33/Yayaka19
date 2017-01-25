import React from 'react'
import { connect } from 'react-redux'

import { Comment, Segment } from 'semantic-ui-react'

import { userSelector } from '../selectors.js'
import Post from './Post.js'

const PostList = ({ posts, onClickUser }) => (
  <Segment.Group>
    {
      posts.map(post => (
        <Segment key={post.id}>
          <Post
            list
            followButton={true}
            post={post}
            onClickUser={() => onClickUser(post.user.name)}
          />
        </Segment>
      ))
    }
  </Segment.Group>
)

PostList.propTypes = {
  posts: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.number.isRequired,
    user: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      display: React.PropTypes.string.isRequired
    }),
    text: React.PropTypes.string.isRequired
  })).isRequired,
  onClickUser: React.PropTypes.func.isRequired
}

export default PostList
