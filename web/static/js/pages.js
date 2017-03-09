import { createPages, CHANGE_PAGE } from 'redux-pages'
import { createReplacer, createAsyncHook, composeMiddleware } from 'redux-middlewares'

import { signedIn } from './global.js'
import {
  requestRandomPost,
  requestTimeline,
  requestPublicTimeline,
  requestUser,
  requestPost, setContexts,
  openNoticesPage,
  showOnlinePosts,
  closeNewPostDialog,
  openMystery
} from './actions/index.js'
import { requestFollowers } from './actions/followersPage.js'
import { requestFollowing } from './actions/followingPage.js'
import {
  pageSelector,
  homePostSelector,
  onlinePostsSelector,
  mysteryPageSelector
} from './selectors.js'

export const pages = createPages()
const p = pages.addPage.bind(pages)

export const home           = p('/', 'home')
export const publicTimeline = p('/p', 'public')
export const timeline       = p('/t', 'timeline')
export const onlinePosts    = p('/o', 'online')
export const userPage       = p('/users/:name', 'user')
export const followersPage  = p('/users/:name/followers', 'followers')
export const followingPage  = p('/users/:name/following', 'following')
export const userFormPage   = p('/users/:name/edit', 'userForm')
export const postPage       = p('/posts/:id', 'post')
export const noticesPage    = p('/n', 'notices')
export const loginPage      = p('/login', 'login')
export const mysteryPage    = p('/mysteries/:id', 'mysteries')
export const newMysteryPage = p('/new-mystery', 'newMystery')
export const errorPage      = p('/*', 'error')

export const passwordUpdateURL = '/login/password/update'
export const passwordLoginURL = '/login/password'
export const apiURL = 'profile/api'
export const logoutURL = '/logout'
export const newAccountURL = '/new'
export const getSwitchUserURL = name => `/switch/${name}`

const onlySignedInMiddleware = createReplacer(
  () => signedIn === false,
  ({ action }) => {
    return timeline.check(action)
      || onlinePosts.check(action)
      || noticesPage.check(action)
      || userFormPage.check(action)
      || mysteryPage.check(action)
      || newMysteryPage.check(action)
  },
  () => loginPage.action()
)

const errorPageHook = createReplacer(
  ({ action }) => errorPage.check(action),
  () => home.action()
)

const closeNewPostDialogMiddleware = createAsyncHook(
  CHANGE_PAGE,
  ({ action }) => {
    return !publicTimeline.check(action) && !timeline.check(action)
  },
  ({ dispatch }) => { dispatch(closeNewPostDialog()) }
)

const homeHook = createReplacer(
  ({ action }) => home.check(action),
  () => {
    if (signedIn) {
      return timeline.action()
    } else {
      return publicTimeline.action()
    }
  }
)

const publicTimelineHook = createAsyncHook(
  ({ action }) => publicTimeline.check(action),
  ({ getState }) => {
    const state = getState()
    return pageSelector(state).name != publicTimeline.name
  },
  ({ dispatch, action }) => {
    dispatch(requestPublicTimeline())
  }
)

const onlinePostsHook = createAsyncHook(
  ({ action }) => onlinePosts.check(action),
  ({ dispatch, getState }) => {
    const { channel } = onlinePostsSelector(getState())
    dispatch(showOnlinePosts(channel))
  }
)

const userPageHook = createAsyncHook(
  ({ action }) => userPage.check(action),
  ({ dispatch, action }) => {
    dispatch(requestUser(action.payload.params.name))
  }
)

const followersPageHook = createAsyncHook(
  ({ action }) => followersPage.check(action),
  ({ dispatch, action }) => {
    const name = action.payload.params.name
    dispatch(requestFollowers(name))
  }
)

const followingPageHook = createAsyncHook(
  ({ action }) => followingPage.check(action),
  ({ dispatch, action }) => {
    const name = action.payload.params.name
    dispatch(requestFollowing(name))
  }
)

const postPageHook = createAsyncHook(
  ({ action }) => postPage.check(action),
  ({ dispatch, action }) => {
    dispatch(requestPost(parseInt(action.payload.params.id, 10)))
    dispatch(setContexts(null))
  }
)

const noticesPageHook = createAsyncHook(
  ({ action }) => noticesPage.check(action),
  ({ dispatch, action }) => {
    dispatch(openNoticesPage())
  }
)

const mysteryPageHook = createAsyncHook(
  ({ action }) => mysteryPage.check(action),
  ({ dispatch, getState, action }) => {
    const id = parseInt(action.payload.params.id, 10)
    const { mystery } = mysteryPageSelector(getState())
    dispatch(openMystery(id))
  }
)

export const pagesMiddleware = composeMiddleware(
  onlySignedInMiddleware,
  errorPageHook,
  closeNewPostDialogMiddleware,
  homeHook,
  publicTimelineHook,
  onlinePostsHook,
  userPageHook,
  followersPageHook,
  followingPageHook,
  postPageHook,
  noticesPageHook,
  mysteryPageHook
)
