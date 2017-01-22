import React from 'react'

const Post = ({ post: {user, text}, onClickUser }) => (
  <div>
    <button className="link" onClick={onClickUser}>
      {user.display}<small>@{user.name}</small>
    </button>
    <pre>
      {text}
    </pre>
  </div>
)

Post.propTypes = {
  post: React.PropTypes.shape({
    user: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      display: React.PropTypes.string.isRequired
    }).isRequired,
    text: React.PropTypes.string.isRequired,
  }),
  onClickUser: React.PropTypes.func.isRequired
}

export default Post
