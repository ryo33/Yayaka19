import React from 'react'
import { connect } from 'react-redux'
import { Segment, Header, Dimmer, Loader } from 'semantic-ui-react'

import { openedMysteriesPageSelector } from '../selectors.js'
import { userPage } from '../pages.js'
import PostList from './PostList.js'

const mapStateToProps = state => {
  const { user: pageUser, openedMysteries, isLoadingOpenedMysteries } = openedMysteriesPageSelector(state)
  return {
    pageUser, openedMysteries, isLoadingOpenedMysteries
  }
}

const actionCreators = {
  userPageAction: (name) => userPage.action({name})
}

const OpenedMysteriesPage = ({ pageUser, openedMysteries, isLoadingOpenedMysteries, userPageAction }) => (
  <div>
    <Segment vertical>
      <Dimmer active={isLoadingOpenedMysteries} inverted>
        <Loader inverted />
      </Dimmer>
      <Header href={userPage.path({name: pageUser.name})}
        onClick={(e) => { e.preventDefault(); userPageAction(pageUser.name) }}>
        {pageUser.display}'s OpenedMysteries
      </Header>
    </Segment>
    <Segment vertical>
      <PostList posts={openedMysteries} followButton={false} />
    </Segment>
  </div>
)

export default connect(mapStateToProps, actionCreators)(OpenedMysteriesPage)
