import React from 'react'
import { connect } from 'react-redux'

import { Feed, Segment, Icon } from 'semantic-ui-react'

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
      <Icon name='send' />
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

const ReplyNotice = ({ reply: { post, target }, userPageAction }) => (
  <Feed.Event>
    <Feed.Label>
      <Icon name='comment' />
    </Feed.Label>
    <Feed.Content>
      <Feed.Summary>
        <Feed.User onClick={() => userPageAction({name: post.user.name})}>
          {post.user.display}
        </Feed.User> (@{post.user.name}) replied to you
      </Feed.Summary>
      <Feed.Extra text>
        <Segment.Group>
          <Segment>
            <Post
              favButton={false}
              replyButton={false}
              post={target}
              onClickUser={() => userPageAction(post.user.name)}
            />
          </Segment>
          <Segment>
            <Post
              post={post}
              onClickUser={() => userPageAction(post.user.name)}
            />
          </Segment>
        </Segment.Group>
      </Feed.Extra>
    </Feed.Content>
  </Feed.Event>
)

const NoticesPage = ({ notices, userPageAction }) => (
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
)

export default connect(mapStateToProps, actionCreators)(NoticesPage)
