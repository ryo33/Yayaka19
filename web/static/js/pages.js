import { createPages, CHANGE_PAGE } from 'redux-pages'
import { createReplacer, createAsyncHook, composeMiddleware } from 'redux-middlewares'

import { signedIn } from './global.js'
import {
  requestRandomPost,
  requestTimeline,
  requestPublicTimeline,
  requestUser, setUserInfo,
  requestPost, setContexts,
  openNoticesPage,
  showOnlinePosts,
  closeNewPostDialog
} from './actions.js'
import {
  pageSelector,
  homePostSelector,
} from './selectors.js'

export const pages = createPages()
const p = pages.addPage.bind(pages)

export const home           = p('/', 'home')
export const publicTimeline = p('/p', 'public')
export const timeline       = p('/t', 'timeline')
export const onlinePosts         = p('/o', 'online')
export const userPage       = p('/users/:name', 'user')
export const userFormPage   = p('/users/:name/edit', 'userForm')
export const postPage       = p('/posts/:id', 'post')
export const noticesPage    = p('/n', 'notices')
export const loginPage      = p('/login', 'login')
export const errorPage      = p('/*', 'error')

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
  ({ dispatch }) => dispatch(showOnlinePosts())
)

const userPageHook = createAsyncHook(
  ({ action }) => userPage.check(action),
  ({ dispatch, action }) => {
    dispatch(setUserInfo({}))
    dispatch(requestUser(action.payload.params.name))
  }
)

const postPageHook = createAsyncHook(
  ({ action }) => postPage.check(action),
  ({ dispatch, action }) => {
    dispatch(requestPost(parseInt(action.payload.params.id, 10)))
    dispatch(setContexts(null))
  }
)

const noticesPageLeaveHook = createAsyncHook(
  CHANGE_PAGE,
  ({ getState }) => pageSelector(getState()).name == noticesPage.name,
  ({ action }) => !noticesPage.check(action),
  ({ dispatch, action }) => {
    dispatch(openNoticesPage())
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
  postPageHook,
  noticesPageLeaveHook
)
