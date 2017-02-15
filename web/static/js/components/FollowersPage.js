import React from 'react'
import { connect } from 'react-redux'
import { Segment, Menu, Icon, Label, Header } from 'semantic-ui-react'

import Time from './Time.js'
import FollowButton from './FollowButton.js'
import { userPage } from '../pages.js'
import { followersPageSelector } from '../selectors.js'

const mapStateToProps = state => {
  const { user: pageUser, followers } = followersPageSelector(state)
  return {
    pageUser, followers
  }
}

const actionCreators = {
  userPageAction: (name) => userPage.action({name})
}

const FollowersPage = ({ pageUser, followers, userPageAction }) => (
  <div>
    <Segment vertical>
      <Header>{pageUser.display}'s Followers</Header>
      <Menu secondary>
        <Menu.Item href={userPage.path({name: pageUser.name})}
          onClick={(e) => { e.preventDefault(); userPageAction(pageUser.name) }}>
          {pageUser.display} @{pageUser.name}
        </Menu.Item>
      </Menu>
    </Segment>
    {
      followers.map(({ id, user, inserted_at }) => (
        <Segment key={id} vertical>
          <Menu secondary>
            <Menu.Item href={userPage.path({name: user.name})}
              onClick={(e) => { e.preventDefault(); userPageAction(user.name) }}>
              {user.display} @{user.name}
            </Menu.Item>
            <Menu.Menu position='right'>
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

export default connect(mapStateToProps, actionCreators)(FollowersPage)
