import React, { Component } from 'react'
import { connect } from 'react-redux'

import { userPage } from '../pages.js'
import { homePostSelector } from '../selectors.js'

const mapDispatchToProps = state => {
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
        <div>
          <button className="link" onClick={this.handleClickUser}>
            {user.display}<small>@{user.name}</small>
          </button>
          <pre>
            {text}
          </pre>
        </div>
      )
    } else {
      return (
        <div>
        </div>
      )
    }
  }
}

export default connect(mapDispatchToProps, actionCreators)(Home)
