import { createPages, CHANGE_PAGE } from 'redux-pages'
import { createReplacer, createMiddleware, composeMiddleware } from 'redux-middlewares'

import { signedIn } from './global.js'
import {
  requestRandomPost,
  requestTimeline,
  requestPublicTimeline,
  requestUser,
  openNoticesPage
} from './actions.js'
import {
  pageSelector,
  homePostSelector,
} from './selectors.js'

export const pages = createPages()
const p = pages.addPage.bind(pages)

export const home = p('/', 'home')
export const publicTimeline = p('/p', 'public')
export const timeline = p('/t', 'timeline')
export const userPage = p('/users/:name', 'user')
export const noticesPage = p('/n', 'notices')
export const loginPage = p('/login', 'login')
export const errorPage = p('/*', 'error')

const onlySignedInMiddleware = createReplacer(
  ({ action }) => timeline.check(action) || noticesPage.check(action),
  () => signedIn === false,
  () => loginPage.action()
)

const errorPageHook = createReplacer(
  ({ action }) => errorPage.check(action),
  () => home.action()
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

const publicTimelineHook = createMiddleware(
  ({ action }) => publicTimeline.check(action),
  ({ getState }) => {
    const state = getState()
    return pageSelector(state).name != publicTimeline.name
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
    return pageSelector(state).name != timeline.name
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

const noticesPageLeaveHook = createMiddleware(
  CHANGE_PAGE,
  ({ getState }) => pageSelector(getState()).name == noticesPage.name,
  ({ action }) => !noticesPage.check(action),
  ({ dispatch, nextDispatch, action }) => {
    nextDispatch(action)
    dispatch(openNoticesPage())
  }
)


export const pagesMiddleware = composeMiddleware(
  onlySignedInMiddleware,
  errorPageHook,
  homeHook,
  publicTimelineHook,
  timelineHook,
  userPageHook,
  noticesPageLeaveHook
)
