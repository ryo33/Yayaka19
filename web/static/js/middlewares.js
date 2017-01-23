import { createMiddleware, createReplacer, composeMiddleware } from 'redux-middlewares'

import { pushMessage } from './socket.js'
import { home, timeline, publicTimeline } from './pages.js'
import {
  reload,
  submitPost, updatePostText,
  requestRandomPost, setHomePost,
  requestUser, setUserInfo,
  requestFollow, requestUnfollow, follow, unfollow,
  requestPublicTimeline, updatePublicTimeline,
  requestTimeline, updateTimeline,
  requestInfo, updateInfo
} from './actions.js'
import { pageSelector } from './selectors.js'

const reloadMiddleware = composeMiddleware(
  createReplacer(
    reload.getType(),
    ({ getState }) => pageSelector(getState()).name === home.name,
    () => requestRandomPost()
  ),
  createReplacer(
    reload.getType(),
    ({ getState }) => pageSelector(getState()).name === publicTimeline.name,
    () => requestPublicTimeline()
  ),
  createReplacer(
    reload.getType(),
    ({ getState }) => pageSelector(getState()).name === timeline.name,
    () => requestTimeline()
  )
)

const submitPostMiddleware = createMiddleware(
  submitPost.getType(),
  ({ dispatch, nextDispatch, action }) => {
    pushMessage('new_post', action.payload)
      .then(() => {
        dispatch(home.action())
        dispatch(updatePostText(''))
      })
    nextDispatch(action)
  }
)

const requestRandomPostMiddleware = createMiddleware(
  requestRandomPost.getType(),
  ({ dispatch, nextDispatch, action }) => {
    setHomePost({})
    pushMessage('random_post', {})
      .then(({ post }) => {
        dispatch(setHomePost(post))
      })
    nextDispatch(action)
  }
)

const requestUserMiddleware = createMiddleware(
  requestUser.getType(),
  ({ dispatch, nextDispatch, action }) => {
    pushMessage('user_info', {name: action.payload})
      .then(resp => {
        dispatch(setUserInfo(resp))
      }, ({ error, timeout }) => {
        dispatch(home.action())
      })
    nextDispatch(action)
  }
)

const requestFollowMiddleware = createMiddleware(
  requestFollow.getType(),
  ({ dispatch, nextDispatch, action }) => {
    const id = action.payload
    pushMessage('follow', id)
      .then(resp => {
        dispatch(follow(id))
      })
    nextDispatch(action)
  }
)

const requestUnfollowMiddleware = createMiddleware(
  requestUnfollow.getType(),
  ({ dispatch, nextDispatch, action }) => {
    const id = action.payload
    pushMessage('unfollow', id)
      .then(resp => {
        dispatch(unfollow(id))
      })
    nextDispatch(action)
  }
)

const requestPublicTimelineMiddleware = createMiddleware(
  requestPublicTimeline.getType(),
  ({ dispatch, nextDispatch, action }) => {
    dispatch(updatePublicTimeline({posts: []}))
    pushMessage('public_timeline', {})
      .then(resp => {
        dispatch(updatePublicTimeline(resp))
      })
    nextDispatch(action)
  }
)

const requestTimelineMiddleware = createMiddleware(
  requestTimeline.getType(),
  ({ dispatch, nextDispatch, action }) => {
    dispatch(updateTimeline({posts: []}))
    pushMessage('timeline', {})
      .then(resp => {
        dispatch(updateTimeline(resp))
      })
    nextDispatch(action)
  }
)

const requestInfoMiddleware = createMiddleware(
  requestInfo.getType(),
  ({ dispatch, nextDispatch, action }) => {
    pushMessage('info', {})
      .then(resp => {
        dispatch(updateInfo(resp))
      })
    nextDispatch(action)
  }
)

export default composeMiddleware(
  reloadMiddleware,
  submitPostMiddleware,
  requestRandomPostMiddleware,
  requestUserMiddleware,
  requestFollowMiddleware,
  requestUnfollowMiddleware,
  requestPublicTimelineMiddleware,
  requestTimelineMiddleware,
  requestInfoMiddleware
)
