import React from 'react'

import Post from './Post.js'

const PostList = ({ posts, onClickUser }) => (
  <div>
    <hr />
    {
      posts.map(post => (
        [
          <Post
            key={post.id}
            post={post}
            onClickUser={() => onClickUser(post.user.name)}
          />,
          <hr />
        ]
      ))
    }
  </div>
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
