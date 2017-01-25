import { createMiddleware, createReplacer, composeMiddleware } from 'redux-middlewares'

import { signedIn } from './global.js'
import { pushMessage, channel, userChannel } from './socket.js'
import { home, timeline, publicTimeline } from './pages.js'
import {
  reload, addFavs,
  submitPost, updatePostText,
  requestUser, setUserInfo,
  requestFollow, requestUnfollow, follow, unfollow,
  requestFav, requestUnfav, fav, unfav,
  requestPublicTimeline, updatePublicTimeline,
  requestTimeline, updateTimeline,
  setCurrentNotices,
  openNoticesPage
} from './actions.js'
import { pageSelector } from './selectors.js'

const reloadMiddleware = composeMiddleware(
  createMiddleware(
    reload.getType(),
    ({ dispatch, nextDispatch, action }) => {
      nextDispatch(action)
    }
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
    pushMessage(userChannel, 'new_post', {post: {text}, address})
      .then(() => {
        dispatch(timeline.action())
        dispatch(updatePostText(''))
      })
  }
)

const requestUserMiddleware = createMiddleware(
  requestUser.getType(),
  ({ dispatch, nextDispatch, action }) => {
    nextDispatch(action)
    pushMessage(channel, 'user_info', {name: action.payload})
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
    pushMessage(userChannel, 'follow', {id})
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
    pushMessage(userChannel, 'unfollow', {id})
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
    pushMessage(userChannel, 'fav', {id})
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
    pushMessage(userChannel, 'unfav', {id})
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
    pushMessage(channel, 'public_timeline', {})
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
    pushMessage(userChannel, 'timeline', {})
      .then(({ posts, favs }) => {
        dispatch(addFavs(favs))
        dispatch(updateTimeline({posts}))
      })
  }
)

const openNoticesPageMiddleware = createMiddleware(
  openNoticesPage.getType(),
  ({ dispatch, nextDispatch, action, getState }) => {
    nextDispatch(action)
    const { notices: { fav, favs, follow, follows, address, addresses }} = getState()
    const nextFav = favs.length >= 1 ? favs[0].id : null
    const nextFollow = follows.length >= 1 ? follows[0].id : null
    const nextAddress = addresses.length >= 1 ? addresses[0].post_addresses[0].id : null
    if (address !== nextAddress || follow !== nextFollow || fav !== nextFav) {
      pushMessage(userChannel, 'open_notices', {fav: nextFav, follow: nextFollow, address: nextAddress})
        .then(resp => dispatch(setCurrentNotices(resp)))
    }
  }
)

let signedInMiddlewares = []
if (signedIn) {
  signedInMiddlewares = [
    submitPostMiddleware,
    requestFollowMiddleware,
    requestUnfollowMiddleware,
    requestFavMiddleware,
    requestUnfavMiddleware,
    requestTimelineMiddleware,
    openNoticesPageMiddleware
  ]
}

export default composeMiddleware(
  ...signedInMiddlewares,
  reloadMiddleware,
  requestUserMiddleware,
  requestPublicTimelineMiddleware
)
