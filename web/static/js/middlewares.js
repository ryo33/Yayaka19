import { createMiddleware, createReplacer, composeMiddleware } from 'redux-middlewares'

import { pushMessage } from './socket.js'
import { home, timeline, publicTimeline } from './pages.js'
import {
  reload, addFavs,
  submitPost, updatePostText,
  requestRandomPost, setHomePost,
  requestUser, setUserInfo,
  requestFollow, requestUnfollow, follow, unfollow,
  requestFav, requestUnfav, fav, unfav,
  requestPublicTimeline, updatePublicTimeline,
  requestTimeline, updateTimeline,
  requestInfo, updateInfo
} from './actions.js'
import { pageSelector } from './selectors.js'

const reloadMiddleware = composeMiddleware(
  createMiddleware(
    reload.getType(),
    ({ dispatch, nextDispatch, action }) => {
      nextDispatch(action)
      dispatch(requestInfo())
    }
  ),
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
    nextDispatch(action)
    const { text, address } = action.payload
    pushMessage('new_post', {post: {text}, address})
      .then(() => {
        dispatch(timeline.action())
        dispatch(updatePostText(''))
      })
  }
)

const requestRandomPostMiddleware = createMiddleware(
  requestRandomPost.getType(),
  ({ dispatch, nextDispatch, action }) => {
    nextDispatch(action)
    setHomePost({})
    pushMessage('random_post', {})
      .then(({ post, favs }) => {
        dispatch(addFavs(favs))
        dispatch(setHomePost(post))
      })
  }
)

const requestUserMiddleware = createMiddleware(
  requestUser.getType(),
  ({ dispatch, nextDispatch, action }) => {
    nextDispatch(action)
    pushMessage('user_info', {name: action.payload})
      .then(resp => {
        dispatch(setUserInfo(resp))
      }, ({ error, timeout }) => {
        dispatch(home.action())
      })
  }
)

const requestFollowMiddleware = createMiddleware(
  requestFollow.getType(),
  ({ dispatch, nextDispatch, action }) => {
    nextDispatch(action)
    const id = action.payload
    pushMessage('follow', {id})
      .then(resp => {
        dispatch(follow(id))
      })
  }
)

const requestUnfollowMiddleware = createMiddleware(
  requestUnfollow.getType(),
  ({ dispatch, nextDispatch, action }) => {
    nextDispatch(action)
    const id = action.payload
    pushMessage('unfollow', {id})
      .then(resp => {
        dispatch(unfollow(id))
      })
  }
)

const requestFavMiddleware = createMiddleware(
  requestFav.getType(),
  ({ dispatch, nextDispatch, action }) => {
    nextDispatch(action)
    const id = action.payload
    pushMessage('fav', {id})
      .then(resp => {
        dispatch(fav(id))
      })
  }
)

const requestUnfavMiddleware = createMiddleware(
  requestUnfav.getType(),
  ({ dispatch, nextDispatch, action }) => {
    nextDispatch(action)
    const id = action.payload
    pushMessage('unfav', {id})
      .then(resp => {
        dispatch(unfav(id))
      })
  }
)

const requestPublicTimelineMiddleware = createMiddleware(
  requestPublicTimeline.getType(),
  ({ dispatch, nextDispatch, action }) => {
    nextDispatch(action)
    dispatch(updatePublicTimeline({posts: []}))
    pushMessage('public_timeline', {})
      .then(({ posts, favs }) => {
        dispatch(addFavs(favs))
        dispatch(updatePublicTimeline({posts}))
      })
  }
)

const requestTimelineMiddleware = createMiddleware(
  requestTimeline.getType(),
  ({ dispatch, nextDispatch, action }) => {
    nextDispatch(action)
    dispatch(updateTimeline({posts: []}))
    pushMessage('timeline', {})
      .then(({ posts, favs }) => {
        dispatch(addFavs(favs))
        dispatch(updateTimeline({posts}))
      })
  }
)

const requestInfoMiddleware = createMiddleware(
  requestInfo.getType(),
  ({ dispatch, nextDispatch, action }) => {
    nextDispatch(action)
    pushMessage('info', {})
      .then(resp => {
        dispatch(updateInfo(resp))
      })
  }
)

export default composeMiddleware(
  reloadMiddleware,
  submitPostMiddleware,
  requestRandomPostMiddleware,
  requestUserMiddleware,
  requestFollowMiddleware,
  requestUnfollowMiddleware,
  requestFavMiddleware,
  requestUnfavMiddleware,
  requestPublicTimelineMiddleware,
  requestTimelineMiddleware,
  requestInfoMiddleware
)
