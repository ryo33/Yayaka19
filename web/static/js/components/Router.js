import React from 'react'

import {
  publicTimeline, timeline, onlinePosts,
  userPage, followersPage, followingPage,
  mysteriesPage, openedMysteriesPage,
  userFormPage, followingServersPage,
  postPage, noticesPage,
  mysteryPage, newMysteryPage, loginPage
} from '../pages.js'
import PublicTimeline from './PublicTimeline.js'
import Timeline from './Timeline.js'
import OnlinePosts from './OnlinePosts.js'
import UserPage from './UserPage.js'
import FollowersPage from './FollowersPage.js'
import FollowingPage from './FollowingPage.js'
import MysteriesPage from './MysteriesPage.js'
import OpenedMysteriesPage from './OpenedMysteriesPage.js'
import UserForm from './UserForm.js'
import FollowingServersPage from './FollowingServersPage.js'
import PostPage from './PostPage.js'
import NoticesPage from './NoticesPage.js'
import MysteryPage from './MysteryPage.js'
import NewMystery from './NewMystery.js'
import LoginPage from './LoginPage.js'
import ErrorPage from './ErrorPage.js'

export default ({ name, params }) => {
  switch (name) {
    case publicTimeline.name:
      return <PublicTimeline />
    case timeline.name:
      return <Timeline />
    case onlinePosts.name:
      return <OnlinePosts />
    case userPage.name:
      return <UserPage params={params} />
    case followersPage.name:
      return <FollowersPage params={params} />
    case followingPage.name:
      return <FollowingPage params={params} />
    case mysteriesPage.name:
      return <MysteriesPage />
    case openedMysteriesPage.name:
      return <OpenedMysteriesPage />
    case userFormPage.name:
      return <UserForm params={params} />
    case followingServersPage.name:
      return <FollowingServersPage params={params} />
    case postPage.name:
      return <PostPage params={params} />
    case noticesPage.name:
      return <NoticesPage />
    case mysteryPage.name:
      return <MysteryPage />
    case newMysteryPage.name:
      return <NewMystery />
    case loginPage.name:
      return <LoginPage />
    default:
      return <ErrorPage />
  }
}
