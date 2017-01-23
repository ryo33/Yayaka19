import React from 'react'
import Linkify from 'react-linkify'

import FollowButton from './FollowButton.js'
import FavButton from './FavButton.js'

const Post = ({ followButton = true, post, onClickUser }) => (
  <div>
    <button className="link" onClick={onClickUser}>
      {post.user.display} <small>@{post.user.name}</small>
    </button>
    {
      followButton
        ? <FollowButton user={post.user} />
        : null
    }
    <pre>
      <Linkify properties={{target: '_blank'}}>
        {post.text}
      </Linkify>
    </pre>
    <FavButton post={post} />
  </div>
)

Post.propTypes = {
  followButton: React.PropTypes.bool,
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
