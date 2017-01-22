import React, { Component } from 'react'
import { connect } from 'react-redux'

import { userPage } from '../pages.js'
import { homePostSelector } from '../selectors.js'
import Post from './Post.js'

const mapStateToProps = state => {
  return {
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
    const { post } = this.props
    const { user, text } = post
    if (user != null) {
      return (
        <Post
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
