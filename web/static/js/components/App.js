import React, { Component } from 'react'
import { connect } from 'react-redux'

import { source } from '../global.js'
import {
  home, publicTimeline, timeline, newPost, userPage, loginPage,
  favNotices, followNotices, addressNotices
} from '../pages.js'
import Home from './Home.js'
import PublicTimeline from './PublicTimeline.js'
import Timeline from './Timeline.js'
import NewPost from './NewPost.js'
import UserPage from './UserPage.js'
import LoginPage from './LoginPage.js'
import ErrorPage from './ErrorPage.js'
import FavNotices from './FavNotices.js'
import FollowNotices from './FollowNotices.js'
import AddressNotices from './AddressNotices.js'
import {
  pageSelector, userSelector, signedInSelector,
  favNoticesCountSelctor, followNoticesCountSelctor, addressNoticesCountSelctor
} from '../selectors.js'

const mapStateToProps = state => {
  return {
    page: pageSelector(state),
    user: userSelector(state),
    signedIn: signedInSelector(state),
    favCount: favNoticesCountSelctor(state),
    followCount: followNoticesCountSelctor(state),
    addressCount: addressNoticesCountSelctor(state),
  }
}

const actionCreators = {
  homeAction: home.action,
  publicTimelineAction: publicTimeline.action,
  timelineAction: timeline.action,
  newPostAction: newPost.action,
  loginPageAction: loginPage.action,
  favNoticesAction: favNotices.action,
  followNoticesAction: followNotices.action,
  addressNoticesAction: addressNotices.action
}

class App extends Component {
  constructor(props) {
    super(props)
  }

  renderPage() {
    const { page } = this.props
    switch (page.name) {
      case home.name:
        return <Home />
      case publicTimeline.name:
        return <PublicTimeline />
      case timeline.name:
        return <Timeline />
      case newPost.name:
        return <NewPost />
      case userPage.name:
        return <UserPage params={page.params} />
      case favNotices.name:
        return <FavNotices />
      case followNotices.name:
        return <FollowNotices />
      case addressNotices.name:
        return <AddressNotices />
      case loginPage.name:
        return <LoginPage />
      default:
        return <ErrorPage />
    }
  }

  renderHeader() {
    const {
      signedIn,
      user,
      homeAction,
      publicTimelineAction,
      timelineAction,
      newPostAction,
      loginPageAction,
      addressNoticesAction, followNoticesAction, favNoticesAction,
      addressCount, followCount, favCount
    } = this.props
    if (signedIn) {
      return (
        <ul>
          <li><button className="link" onClick={homeAction}>Home</button></li>
          <li>
            <button className="link" onClick={addressNoticesAction}>
              Address ({addressCount})
            </button>
            <button className="link" onClick={followNoticesAction}>
              Follow ({followCount})
            </button>
            <button className="link" onClick={favNoticesAction}>
              Fav ({favCount})
            </button>
          </li>
          <li><button className="link" onClick={timelineAction}>Timeline</button></li>
          <li><button className="link" onClick={publicTimelineAction}>Public Timeline</button></li>
          <li><button className="link" onClick={newPostAction}>New Post</button></li>
          <li><a href={source.url}>GitHub</a></li>
          <li><a href="/logout">Sign out</a></li>
        </ul>
      )
    } else {
      return (
        <ul>
          <li><button className="link" onClick={homeAction}>Home</button></li>
          <li><button className="link" onClick={publicTimelineAction}>Public Timeline</button></li>
          <li><button className="link" onClick={loginPageAction}>Sign in</button></li>
          <li><a href={source.url}>GitHub</a></li>
        </ul>
      )
      // Not signed in
    }
  }

  render() {
    return (
      <div>
        {this.renderHeader()}
        {this.renderPage()}
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(App)
