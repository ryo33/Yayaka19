import React, { Component } from 'react'
import { connect } from 'react-redux'

import { userPage } from '../pages.js'
import { userSelector, homePostSelector } from '../selectors.js'
import Post from './Post.js'

const mapStateToProps = state => {
  return {
    user: userSelector(state),
    post: homePostSelector(state)
  }
}

const actionCreators = {
  userPageAction: userPage.action
}

class Home extends Component {
  constructor(props) {
    super(props)
    this.handleClickUser = this.handleClickUser.bind(this)
  }

  handleClickUser() {
    const { post, userPageAction } = this.props
    const { user } = post
    userPageAction({name: user.name})
  }

  render() {
    const { post, user } = this.props
    if (post.user != null) {
      return (
        <Post
          user={user}
          post={post}
          onClickUser={this.handleClickUser}
        />
      )
    } else {
      return (
        <div>
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, actionCreators)(Home)
