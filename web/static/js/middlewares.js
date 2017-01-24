import { createMiddleware, createReplacer, composeMiddleware } from 'redux-middlewares'

import { pushMessage, channel } from './socket.js'
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
  requestInfo, updateInfo,
  setCurrentNotices,
  openFavNotices, openFollowNotices, openAddressNotices
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
    pushMessage(channel, 'new_post', {post: {text}, address})
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
    pushMessage(channel, 'random_post', {})
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
    pushMessage(channel, 'follow', {id})
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
    pushMessage(channel, 'unfollow', {id})
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
    pushMessage(channel, 'fav', {id})
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
    pushMessage(channel, 'unfav', {id})
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
    pushMessage(channel, 'timeline', {})
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
    pushMessage(channel, 'info', {})
      .then(resp => {
        dispatch(updateInfo(resp))
      })
  }
)

const openFavNoticesMiddleware = createMiddleware(
  openFavNotices.getType(),
  ({ dispatch, nextDispatch, action, getState }) => {
    nextDispatch(action)
    const { notices: { fav, favs }} = getState()
    const nextFav = favs.length >= 1 ? favs[0].id : null
    if (fav !== nextFav) {
      pushMessage(channel, 'open_fav_notice', {id: nextFav})
        .then(resp => dispatch(setCurrentNotices(resp)))
    }
  }
)

const openFollowNoticesMiddleware = createMiddleware(
  openFollowNotices.getType(),
  ({ dispatch, nextDispatch, action, getState }) => {
    nextDispatch(action)
    const { notices: { follow, follows }} = getState()
    const nextFollow = follows.length >= 1 ? follows[0].id : null
    if (follow !== nextFollow) {
      pushMessage(channel, 'open_follow_notice', {id: nextFollow})
        .then(resp => dispatch(setCurrentNotices(resp)))
    }
  }
)

const openAddressNoticesMiddleware = createMiddleware(
  openAddressNotices.getType(),
  ({ dispatch, nextDispatch, action, getState }) => {
    nextDispatch(action)
    const { notices: { address, addresses }} = getState()
    const nextAddress = addresses.length >= 1 ? addresses[0].post_addresses[0].id : null
    if (address !== nextAddress) {
      pushMessage(channel, 'open_address_notice', {id: nextAddress})
        .then(resp => dispatch(setCurrentNotices(resp)))
    }
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
  requestInfoMiddleware,
  openFavNoticesMiddleware,
  openFollowNoticesMiddleware,
  openAddressNoticesMiddleware
)
