import React from 'react'
import { connect } from 'react-redux'
import { Segment, Menu, Icon, Label, Header } from 'semantic-ui-react'

import Time from './Time.js'
import FollowButton from './FollowButton.js'
import { userPage } from '../pages.js'
import {
  userSelector, followersSelector, followingPageSelector
} from '../selectors.js'

const mapStateToProps = (state, { params }) => {
  const user = userSelector(state)
  const isMe = user.name === params.name
  const followers = followersSelector(state)
  const { user: pageUser, following } = followingPageSelector(state)
  return {
    isMe, user, followers, pageUser, following
  }
}

const actionCreators = {
  userPageAction: (name) => userPage.action({name})
}

const FollowingPage = ({
  isMe, user, followers, pageUser, following, userPageAction
}) => (
  <div>
    <Segment vertical>
      <Header>{pageUser.display}'s Following</Header>
      <Menu secondary>
        <Menu.Item href={userPage.path({name: pageUser.name})}
          onClick={(e) => { e.preventDefault(); userPageAction(pageUser.name) }}>
          {pageUser.display} @{pageUser.name}
        </Menu.Item>
      </Menu>
    </Segment>
    {
      following.map(({ id, target_user: user, inserted_at }) => (
        <Segment key={id} vertical>
          <Menu secondary>
            <Menu.Item href={userPage.path({name: user.name})}
              onClick={(e) => { e.preventDefault(); userPageAction(user.name) }}>
              {user.display} @{user.name}
            </Menu.Item>
            <Menu.Menu position='right'>
              <Menu.Item>
                {isMe && followers.includes(user.id) ? (
                  <Icon name='exchange' color='blue' size='large' />
                ) : null}
              </Menu.Item>
              <Menu.Item>
                <Time time={inserted_at} />
              </Menu.Item>
              <Menu.Item>
                <FollowButton user={user} floated='right' />
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Segment>
      ))
    }
  </div>
)

export default connect(mapStateToProps, actionCreators)(FollowingPage)
