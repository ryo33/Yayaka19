import React from 'react'
import { connect } from 'react-redux'

import UserButton from './UserButton.js'
import FollowButton from './FollowButton.js'

const mapStateToProps = ({ notices: { follow, follows }}) => {
  return { follow, follows }
}

const actionCreators = {
}

const FollowNotices = ({ follow, follows }) => (
  <div>
    <h2>Follows</h2>
    {
      follows.map(({ id, user }) => {
        return (
          <div key={id}>
            <UserButton
              user={user}
              className="link"
            >
              {user.display} (@{user.name})
            </UserButton>
            followed you
            <FollowButton
              user={user}
            />
          </div>
        )
      })
    }
  </div>
)

export default connect(mapStateToProps, actionCreators)(FollowNotices)
