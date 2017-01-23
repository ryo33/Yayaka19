import React, { Component } from 'react'
import { connect } from 'react-redux'

import { userPage } from '../pages.js'
import { infoSelector, userSelector, homePostSelector } from '../selectors.js'
import Post from './Post.js'
import ReloadButton from './ReloadButton.js'

const mapStateToProps = state => {
  return {
    info: infoSelector(state),
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

  renderInfo() {
    const { users, posts } = this.props.info
    if (posts + users >= 1) {
      return (
        <p>
          <strong>{users}</strong> users and <strong>{posts}</strong> posts.
        </p>
      )
    } else {
      return null
    }
  }

  renderPost() {
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
      return null
    }
  }

  render() {
    return (
      <div>
        {this.renderInfo()}
        <ReloadButton />
        {this.renderPost()}
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(Home)
