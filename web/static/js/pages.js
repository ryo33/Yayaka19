import { createPages, CHANGE_PAGE } from 'redux-pages'
import { createReplacer, createMiddleware, composeMiddleware } from 'redux-middlewares'

import { token } from './global.js'
import {
  requestRandomPost,
  requestTimeline,
  requestPublicTimeline,
  requestUser,
  requestInfo
} from './actions.js'
import {
  signedInSelector
} from './selectors.js'

export const pages = createPages()
const p = pages.addPage.bind(pages)

export const home = p('/', 'home')
export const publicTimeline = p('/p', 'public')
export const timeline = p('/t', 'timeline')
export const newPost = p('/new', 'new')
export const userPage = p('/users/:name', 'user')
export const loginPage = p('/login', 'login')
export const errorPage = p('/*', 'error')

const onlySignedInMiddleware = createReplacer(
  ({ action }) => newPost.check(action) || timeline.check(action),
  ({ getState }) => signedInSelector(getState()) === false,
  () => home.action()
)

const homeHook = createMiddleware(
  ({ action }) => home.check(action),
  ({ dispatch, nextDispatch, action }) => {
    dispatch(requestRandomPost())
    dispatch(requestInfo())
    nextDispatch(action)
  }
)

const publicTimelineHook = createMiddleware(
  ({ action }) => publicTimeline.check(action),
  ({ dispatch, nextDispatch, action }) => {
    dispatch(requestPublicTimeline())
    nextDispatch(action)
  }
)

const timelineHook = createMiddleware(
  ({ action }) => timeline.check(action),
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

export const pagesMiddleware = composeMiddleware(
  onlySignedInMiddleware,
  homeHook,
  publicTimelineHook,
  timelineHook,
  userPageHook
)
