import React from 'react'
import Linkify from 'react-linkify'

import FollowButton from './FollowButton.js'
import FavButton from './FavButton.js'
import UserButton from './UserButton.js'

const PostAddresses = ({ addresses = [] }) => (
  <div>
    {
      addresses.map(({ user }) => (
        <span key={user.name}>
          <UserButton user={user} className="link">
            @{user.name}
          </UserButton>
          ({user.display})
        </span>
      ))
    }
  </div>
)

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
    <PostAddresses addresses={post.post_addresses} />
    <pre>
      <Linkify properties={{target: '_blank'}}>
        {post.text}
      </Linkify>
    </pre>
    <FavButton post={post} />
  </div>
)

const user = React.PropTypes.shape({
  name: React.PropTypes.string.isRequired,
  display: React.PropTypes.string.isRequired
})
Post.propTypes = {
  followButton: React.PropTypes.bool,
  post: React.PropTypes.shape({
    post_addresses: React.PropTypes.arrayOf(React.PropTypes.shape({
      user
    })),
    user: user.isRequired,
    text: React.PropTypes.string.isRequired,
  }),
  onClickUser: React.PropTypes.func.isRequired
}

export default Post
