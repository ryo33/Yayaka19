import { createPages, CHANGE_PAGE } from 'redux-pages'
import { createReplacer, createMiddleware, composeMiddleware } from 'redux-middlewares'

import { signedIn } from './global.js'
import {
  requestRandomPost,
  requestTimeline,
  requestPublicTimeline,
  requestUser,
  openFavNotices,
  openFollowNotices,
  openAddressNotices
} from './actions.js'
import {
  pageSelector,
  homePostSelector,
  publicTimelinePostsSelector,
  timelinePostsSelector
} from './selectors.js'

export const pages = createPages()
const p = pages.addPage.bind(pages)

export const home = p('/', 'home')
export const publicTimeline = p('/p', 'public')
export const timeline = p('/t', 'timeline')
export const newPost = p('/new', 'new')
export const userPage = p('/users/:name', 'user')
export const favNotices = p('/n/fav', 'fav notices')
export const followNotices = p('/n/follow', 'follow notices')
export const addressNotices = p('/n/address', 'address notices')
export const loginPage = p('/login', 'login')
export const errorPage = p('/*', 'error')

const onlySignedInMiddleware = createReplacer(
  ({ action }) => newPost.check(action) || timeline.check(action),
  () => signedIn === false,
  () => home.action()
)

const homeHook = createMiddleware(
  ({ action }) => home.check(action),
  ({ getState }) => {
    const state = getState()
    const notLoaded = !homePostSelector(getState()).user
    return notLoaded || pageSelector(state).name != home.name
  },
  ({ dispatch, nextDispatch, action }) => {
    dispatch(requestRandomPost())
    nextDispatch(action)
  }
)

const publicTimelineHook = createMiddleware(
  ({ action }) => publicTimeline.check(action),
  ({ getState }) => {
    const state = getState()
    const notLoaded = publicTimelinePostsSelector(getState()).length == 0
    return notLoaded || pageSelector(state).name != publicTimeline.name
  },
  ({ dispatch, nextDispatch, action }) => {
    dispatch(requestPublicTimeline())
    nextDispatch(action)
  }
)

const timelineHook = createMiddleware(
  ({ action }) => timeline.check(action),
  ({ getState }) => {
    const state = getState()
    const notLoaded = timelinePostsSelector(getState()).length == 0
    return notLoaded || pageSelector(state).name != timeline.name
  },
  ({ dispatch, nextDispatch, action }) => {
    dispatch(requestTimeline())
    nextDispatch(action)
  }
)

const userPageHook = createMiddleware(
  ({ action }) => userPage.check(action),
  ({ dispatch, nextDispatch, action }) => {
    dispatch(requestUser(action.payload.params.name))
    nextDispatch(action)
  }
)

const favNoticesHook = createMiddleware(
  ({ action }) => favNotices.check(action),
  ({ dispatch, nextDispatch, action }) => {
    nextDispatch(action)
    dispatch(openFavNotices())
  }
)

const followNoticesHook = createMiddleware(
  ({ action }) => followNotices.check(action),
  ({ dispatch, nextDispatch, action }) => {
    nextDispatch(action)
    dispatch(openFollowNotices())
  }
)

const addressNoticesHook = createMiddleware(
  ({ action }) => addressNotices.check(action),
  ({ dispatch, nextDispatch, action }) => {
    nextDispatch(action)
    dispatch(openAddressNotices())
  }
)

export const pagesMiddleware = composeMiddleware(
  onlySignedInMiddleware,
  homeHook,
  publicTimelineHook,
  timelineHook,
  userPageHook,
  favNoticesHook,
  followNoticesHook,
  addressNoticesHook
)
