import React from 'react'
import { connect } from 'react-redux'

import PostList from './PostList.js'
import { userPage } from '../pages.js'

const mapStateToProps = ({ notices: { address, addresses }}) => {
  return { address, addresses }
}

const actionCreators = {
}

const AddressNotices = ({ address, addresses }) => (
  <div>
    <h2>Addresses</h2>
    <PostList
      posts={addresses}
      onClickUser={user => userPage.action({name: user.name})}
    />
  </div>
)

export default connect(mapStateToProps, actionCreators)(AddressNotices)

