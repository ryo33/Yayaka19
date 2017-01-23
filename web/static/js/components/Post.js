import React from 'react'
import Linkify from 'react-linkify'

import FollowButton from './FollowButton.js'

const Post = ({ followButton = true, post: {user, text}, onClickUser }) => (
  <div>
    <button className="link" onClick={onClickUser}>
      {user.display}<small>@{user.name}</small>
    </button>
    {
      followButton
        ? <FollowButton user={user} />
        : null
    }
    <pre>
      <Linkify properties={{target: '_blank'}}>
        {text}
      </Linkify>
    </pre>
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
