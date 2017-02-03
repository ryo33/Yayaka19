import React from 'react'
import { connect } from 'react-redux'

import { Header, Feed, Segment, Icon } from 'semantic-ui-react'

import Time from './Time.js'
import { userPage } from '../pages.js'
import Post from './Post.js'
import FollowButton from './FollowButton.js'
import { compareNotices } from '../utils.js'

const mapStateToProps = ({ notices: { favs, follows, addresses, replies }}) => {
  const list = []
  list.push(...favs.map(fav => ({fav})))
  list.push(...follows.map(follow => ({follow})))
  list.push(...addresses.map(address => ({address})))
  list.push(...replies.map(reply => ({reply})))
  list.sort((l, r) => {
    const a = l.fav || l.follow || l.address || l.reply
    const b = r.fav || r.follow || r.address || r.reply
    // DESC
    return compareNotices(a, b)
  })
  return {
    notices: list
  }
}

const actionCreators = {
  userPageAction: name => userPage.action({name})
}

const FavNotice = ({ fav: { user, post, inserted_at }, userPageAction }) => (
  <Feed.Event>
    <Feed.Label>
      <Icon name='star' />
    </Feed.Label>
    <Feed.Content>
      <Feed.Summary>
        <Feed.User onClick={() => userPageAction(user.name)}>
          {user.display}
        </Feed.User> (@{user.name}) favorited
        <Feed.Date>
          <Time time={inserted_at} />
        </Feed.Date>
      </Feed.Summary>
      <Feed.Extra text>
        <Segment>
          <Post
            actions={false}
            post={post}
          />
        </Segment>
      </Feed.Extra>
    </Feed.Content>
  </Feed.Event>
)

const FollowNotice = ({ follow: { user, inserted_at }, userPageAction}) => (
  <Feed.Event>
    <Feed.Label>
      <Icon name='add user' />
    </Feed.Label>
    <Feed.Content>
      <Feed.Summary>
        <Feed.User onClick={() => userPageAction(user.name)}>
          {user.display}
        </Feed.User> (@{user.name}) followed you <FollowButton user={user} />
        <Feed.Date>
          <Time time={inserted_at} />
        </Feed.Date>
      </Feed.Summary>
    </Feed.Content>
  </Feed.Event>
)

const AddressNotice = ({ address, userPageAction }) => (
  <Feed.Event>
    <Feed.Label>
      <Icon name='send' />
    </Feed.Label>
    <Feed.Content>
      <Feed.Summary>
        <Feed.User onClick={() => userPageAction(address.user.name)}>
          {address.user.display}
        </Feed.User> (@{address.user.name}) addressed you
        <Feed.Date>
          <Time time={address.inserted_at} />
        </Feed.Date>
      </Feed.Summary>
      <Feed.Extra text>
        <Segment>
          <Post
            post={address}
          />
        </Segment>
      </Feed.Extra>
    </Feed.Content>
  </Feed.Event>
)

const ReplyNotice = ({ reply: { post, inserted_at }, userPageAction }) => (
  <Feed.Event>
    <Feed.Label>
      <Icon name='comment' />
    </Feed.Label>
    <Feed.Content>
      <Feed.Summary>
        <Feed.User onClick={() => userPageAction(post.user.name)}>
          {post.user.display}
        </Feed.User> (@{post.user.name}) replied to you
        <Feed.Date>
          <Time time={inserted_at} />
        </Feed.Date>
      </Feed.Summary>
      <Feed.Extra text>
        <Segment>
          <Post
            post={post}
          />
        </Segment>
      </Feed.Extra>
    </Feed.Content>
  </Feed.Event>
)

const NoticesPage = ({ notices, userPageAction }) => (
  <div>
    <Segment vertical>
      <Header>Notifications</Header>
    </Segment>
    <Feed>
      {
        notices.map(({ fav, follow, address, reply }) => {
          if (fav) {
            return <FavNotice key={`fav${fav.id}`} fav={fav} userPageAction={userPageAction} />
          } else if (follow) {
            return <FollowNotice key={`follow${follow.id}`} follow={follow} userPageAction={userPageAction} />
          } else if (address) {
            return <AddressNotice key={`address${address.id}`} address={address} userPageAction={userPageAction} />
          } else if (reply) {
            return <ReplyNotice key={`reply${reply.id}`} reply={reply} userPageAction={userPageAction} />
          }
        })
      }
    </Feed>
  </div>
)

export default connect(mapStateToProps, actionCreators)(NoticesPage)
