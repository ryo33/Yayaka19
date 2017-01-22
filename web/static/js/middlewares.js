import { createMiddleware, composeMiddleware } from 'redux-middlewares'

import { pushMessage } from './socket.js'
import { home } from './pages.js'
import {
  submitPost, updatePostText,
  requestRandomPost, setHomePost,
  requestUser, setUserInfo,
  requestFollow, requestUnfollow, follow, unfollow
} from './actions.js'

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
      }, ({ error, timeout }) => {
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
      }, ({ error, timeout }) => {
      })
    nextDispatch(action)
  }
)

export default composeMiddleware(
  submitPostMiddleware,
  requestRandomPostMiddleware,
  requestUserMiddleware,
  requestFollowMiddleware,
  requestUnfollowMiddleware
)
