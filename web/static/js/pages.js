import { createPages, CHANGE_PAGE } from 'redux-pages'
import {
  createMiddleware, createReplacer, createAsyncHook, composeMiddleware
} from 'redux-middlewares'

import { signedIn } from './global.js'
import {
  requestRandomPost,
  requestTimeline,
  requestPublicTimeline,
  requestUser,
  requestPost, setContexts,
  openNoticesPage,
  closeNewPostDialog,
  openMystery,
  requestMysteries,
  requestOpenedMysteries,
  requestFollowingServers,
  saveRedirectedPage
} from './actions/index.js'
import { requestFollowers } from './actions/followersPage.js'
import { requestFollowing } from './actions/followingPage.js'
import {
  pageSelector,
  homePostSelector,
  mysteryPageSelector
} from './selectors.js'

export const pages = createPages()
const p = pages.addPage.bind(pages)

export const home                = p('/', 'home')
export const publicTimeline      = p('/p', 'public')
export const timeline            = p('/t', 'timeline')
export const userPage            = p('/users/:name', 'user')
export const followersPage       = p('/users/:name/followers', 'followers')
export const followingPage       = p('/users/:name/following', 'following')
export const mysteriesPage       = p('/users/:name/mysteries', 'userMysteries')
export const openedMysteriesPage = p('/users/:name/opened-mysteries', 'openedMysteries')
export const userFormPage        = p('/users/:name/edit', 'userForm')
export const followingServersPage =
  p('/users/:name/following-servers', 'followingServers')
export const remoteUserPage      = p('/remote-user')

export const postPage            = p('/posts/:id', 'post')
export const noticesPage         = p('/n', 'notices')
export const loginPage           = p('/login', 'login')
export const mysteryPage         = p('/mysteries/:id', 'mystery')
export const newMysteryPage      = p('/new-mystery', 'newMystery')
export const errorPage           = p('/*', 'error')

export const termsURL = '/terms'
export const privacyURL = '/privacy'
export const passwordUpdateURL = '/login/password/update'
export const passwordLoginURL = '/login/password'
export const apiURL = '/profile/api'
export const logoutURL = '/logout'
export const newAccountURL = '/new'
export const getSwitchUserURL = name => `/switch/${name}`

const onlySignedInMiddleware = createMiddleware(
  ({ action }) => signedIn === false && action.type === CHANGE_PAGE,
  ({ action }) => {
    return timeline.check(action)
      || noticesPage.check(action)
      || userFormPage.check(action)
      || mysteryPage.check(action)
      || newMysteryPage.check(action)
  },
  ({ dispatch, nextDispatch, action }) => {
    dispatch(saveRedirectedPage(action))
    dispatch(loginPage.action())
  }
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

const mysteriesPageHook = createAsyncHook(
  ({ action }) => mysteriesPage.check(action),
  ({ dispatch, action }) => {
    const name = action.payload.params.name
    dispatch(requestMysteries(name))
  }
)

const openedMysteriesPageHook = createAsyncHook(
  ({ action }) => openedMysteriesPage.check(action),
  ({ dispatch, action }) => {
    const name = action.payload.params.name
    dispatch(requestOpenedMysteries(name))
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

const followingServersPageHook = createAsyncHook(
  ({ action }) => followingServersPage.check(action),
  ({ dispatch, action }) => {
    const name = action.payload.params.name
    dispatch(requestFollowingServers(name))
  }
)

export const pagesMiddleware = composeMiddleware(
  onlySignedInMiddleware,
  errorPageHook,
  closeNewPostDialogMiddleware,
  homeHook,
  publicTimelineHook,
  userPageHook,
  followersPageHook,
  followingPageHook,
  mysteriesPageHook,
  openedMysteriesPageHook,
  postPageHook,
  noticesPageHook,
  mysteryPageHook,
  followingServersPageHook
)
