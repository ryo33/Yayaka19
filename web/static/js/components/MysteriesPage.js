import React from 'react'
import { connect } from 'react-redux'
import { Segment, Header, Dimmer, Loader } from 'semantic-ui-react'

import { mysteriesPageSelector } from '../selectors.js'
import { userPage } from '../pages.js'
import PostList from './PostList.js'

const mapStateToProps = state => {
  const { user: pageUser, mysteries, isLoadingMysteries } = mysteriesPageSelector(state)
  return {
    pageUser, mysteries, isLoadingMysteries
  }
}

const actionCreators = {
  userPageAction: (name) => userPage.action({name})
}

const MysteriesPage = ({ pageUser, mysteries, isLoadingMysteries, userPageAction }) => (
  <div>
    <Segment vertical>
      <Header href={userPage.path({name: pageUser.name})}
        onClick={(e) => { e.preventDefault(); userPageAction(pageUser.name) }}>
        {pageUser.display}'s Mysteries
      </Header>
    </Segment>
    <Segment vertical>
      <Dimmer active={isLoadingMysteries} inverted>
        <Loader inverted />
      </Dimmer>
      <PostList posts={mysteries} followButton={false} />
    </Segment>
  </div>
)

export default connect(mapStateToProps, actionCreators)(MysteriesPage)
