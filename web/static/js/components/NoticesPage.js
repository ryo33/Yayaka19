import React from 'react'
import { connect } from 'react-redux'

import { Feed, Segment, Icon } from 'semantic-ui-react'

import { userPage } from '../pages.js'
import Post from './Post.js'
import FollowButton from './FollowButton.js'

const mapStateToProps = ({ notices: { favs, follows, addresses }}) => {
  const list = []
  list.push(...favs.map(fav => ({fav})))
  list.push(...follows.map(follow => ({follow})))
  list.push(...addresses.map(address => ({address})))
  list.sort((l, r) => {
    const a = l.fav || l.follow || l.address
    const b = r.fav || r.follow || r.address
    // DESC
    if (a.inserted_at > b.inserted_at) {
      return -1
    } else if (a.inserted_at < b.inserted_at) {
      return 1
    } else {
      return 0
    }
  })
  return {
    notices: list
  }
}

const actionCreators = {
  userPageAction: userPage.action
}

const FavNotice = ({ fav: { user, post }, userPageAction }) => (
  <Feed.Event>
    <Feed.Label>
      <Icon name='star' />
    </Feed.Label>
    <Feed.Content>
      <Feed.Summary>
        <Feed.User onClick={() => userPageAction({name: user.name})}>
          {user.display}
        </Feed.User> (@{user.name}) favorited
      </Feed.Summary>
      <Feed.Extra text>
        <Segment>
          <Post
            favButton={false}
            post={post}
            onClickUser={() => {}}
          />
        </Segment>
      </Feed.Extra>
    </Feed.Content>
  </Feed.Event>
)

const FollowNotice = ({ follow: { user }, userPageAction}) => (
  <Feed.Event>
    <Feed.Label>
      <Icon name='add user' />
    </Feed.Label>
    <Feed.Content>
      <Feed.Summary>
        <Feed.User onClick={() => userPageAction({name: user.name})}>
          {user.display}
        </Feed.User> (@{user.name}) followed you <FollowButton user={user} />
      </Feed.Summary>
    </Feed.Content>
  </Feed.Event>
)

const AddressNotice = ({ address, userPageAction }) => (
  <Feed.Event>
    <Feed.Label>
      <Icon name='comment' />
    </Feed.Label>
    <Feed.Content>
      <Feed.Summary>
        <Feed.User onClick={() => userPageAction({name: address.user.name})}>
          {address.user.display}
        </Feed.User> (@{address.user.name}) addressed you
      </Feed.Summary>
      <Feed.Extra text>
        <Segment>
          <Post
            post={address}
            onClickUser={() => userPageAction(address.user.name)}
          />
        </Segment>
      </Feed.Extra>
    </Feed.Content>
  </Feed.Event>
)

const NoticesPage = ({ notices, userPageAction }) => (
  <Feed>
    {
      notices.map(({ fav, follow, address }) => {
        if (fav) {
          return <FavNotice key={`fav${fav.id}`} fav={fav} userPageAction={userPageAction} />
        } else if (follow) {
          return <FollowNotice key={`follow${follow.id}`} follow={follow} userPageAction={userPageAction} />
        } else {
          return <AddressNotice key={`address${address.id}`} address={address} userPageAction={userPageAction} />
        }
      })
    }
  </Feed>
)

export default connect(mapStateToProps, actionCreators)(NoticesPage)
