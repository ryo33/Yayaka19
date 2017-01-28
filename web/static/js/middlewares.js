import { createAsyncHook, createReplacer, composeMiddleware } from 'redux-middlewares'

import { signedIn } from './global.js'
import { pushMessage, channel, userChannel } from './socket.js'
import { loginPage, home, timeline, publicTimeline } from './pages.js'
import {
  submitPost, updatePostText,
  requestUser, setUserInfo,
  requestFollow, requestUnfollow, follow, unfollow,
  requestFav, requestUnfav, fav, unfav,
  requestPublicTimeline, updatePublicTimeline,
  requestTimeline, updateTimeline, addFavs,
  openNoticesPage, updateNoticed
} from './actions.js'
import { pageSelector } from './selectors.js'
import { compareNotices } from './utils.js'

const redirectLoginPageMiddleware = createReplacer(
  () => !signedIn,
  [requestFav.getType()],
  () => loginPage.action()
)

const submitPostMiddleware = createAsyncHook(
  submitPost.getType(),
  ({ dispatch, action }) => {
    const { text, address, post } = action.payload
    const payload = {post: {text, post_id: post}, address}
    pushMessage(userChannel, 'new_post', payload).then(() => {})
  }
)

const requestUserMiddleware = createAsyncHook(
  requestUser.getType(),
  ({ dispatch, action }) => {
    setUserInfo({})
    pushMessage(channel, 'user_info', {name: action.payload})
      .then(resp => {
        dispatch(setUserInfo(resp))
      }, ({ error, timeout }) => {
        dispatch(home.action())
      })
  }
)

const requestFollowMiddleware = createAsyncHook(
  requestFollow.getType(),
  ({ dispatch, action }) => {
    const id = action.payload
    pushMessage(userChannel, 'follow', {id})
      .then(resp => {
        dispatch(follow(id))
      })
  }
)

const requestUnfollowMiddleware = createAsyncHook(
  requestUnfollow.getType(),
  ({ dispatch, action }) => {
    const id = action.payload
    pushMessage(userChannel, 'unfollow', {id})
      .then(resp => {
        dispatch(unfollow(id))
      })
  }
)

const requestFavMiddleware = createAsyncHook(
  requestFav.getType(),
  ({ dispatch, action }) => {
    const id = action.payload
      pushMessage(userChannel, 'fav', {id})
        .then(resp => { dispatch(fav(id)) })
  }
)

const requestUnfavMiddleware = createAsyncHook(
  requestUnfav.getType(),
  ({ dispatch, action }) => {
    const id = action.payload
    pushMessage(userChannel, 'unfav', {id})
      .then(resp => { dispatch(unfav(id)) })
  }
)

const requestPublicTimelineMiddleware = createAsyncHook(
  requestPublicTimeline.getType(),
  ({ dispatch, action }) => {
    dispatch(updatePublicTimeline({posts: []}))
    pushMessage(channel, 'public_timeline', {})
      .then(({ posts, favs }) => {
        dispatch(addFavs(favs))
        dispatch(updatePublicTimeline({posts}))
      })
  }
)

const requestTimelineMiddleware = createAsyncHook(
  requestTimeline.getType(),
  ({ dispatch, action }) => {
    dispatch(updateTimeline([]))
    pushMessage(userChannel, 'timeline', {})
      .then(({ posts, favs }) => {
        dispatch(addFavs(favs))
        dispatch(updateTimeline(posts))
      })
  }
)

const openNoticesPageMiddleware = createAsyncHook(
  openNoticesPage.getType(),
  ({ dispatch, action, getState }) => {
    setTimeout(() => {
      const { notices: { noticed, favs, follows, addresses, replies }} = getState()
      const ns = [favs, follows, addresses, replies]
        .filter(n => n.length != 0)
        .map(n => n[0])
      if (ns.length != 0) {
        const max = ns.sort(compareNotices)[0].inserted_at
        if (max != noticed) {
          pushMessage(userChannel, 'open_notices', {noticed: max})
            .then(({noticed}) => dispatch(updateNoticed(noticed)))
        }
      }
    }, 0)
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
  redirectLoginPageMiddleware,
  requestUserMiddleware,
  requestPublicTimelineMiddleware
)
