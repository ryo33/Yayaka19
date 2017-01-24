import { createPages, CHANGE_PAGE } from 'redux-pages'
import { createReplacer, createMiddleware, composeMiddleware } from 'redux-middlewares'

import { token } from './global.js'
import {
  requestRandomPost,
  requestTimeline,
  requestPublicTimeline,
  requestUser
} from './actions.js'
import {
  pageSelector,
  signedInSelector,
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
export const loginPage = p('/login', 'login')
export const errorPage = p('/*', 'error')

const onlySignedInMiddleware = createReplacer(
  ({ action }) => newPost.check(action) || timeline.check(action),
  ({ getState }) => signedInSelector(getState()) === false,
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

export const pagesMiddleware = composeMiddleware(
  onlySignedInMiddleware,
  homeHook,
  publicTimelineHook,
  timelineHook,
  userPageHook
)
