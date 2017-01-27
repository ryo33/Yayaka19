import { createMiddleware, createReplacer, composeMiddleware } from 'redux-middlewares'

import { signedIn } from './global.js'
import { pushMessage, channel, userChannel } from './socket.js'
import { loginPage, home, timeline, publicTimeline } from './pages.js'
import {
  reload, addFavs,
  submitPost, updatePostText,
  requestUser, setUserInfo,
  requestFollow, requestUnfollow, follow, unfollow,
  requestFav, requestUnfav, fav, unfav,
  requestPublicTimeline, updatePublicTimeline,
  requestTimeline, updateTimeline,
  openNoticesPage, updateNoticed
} from './actions.js'
import { pageSelector } from './selectors.js'
import { compareNotices } from './utils.js'

const redirectLoginPageMiddleware = createReplacer(
  () => !signedIn,
  [requestFav.getType()],
  () => loginPage.action()
)

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
    const { text, address, post } = action.payload
    const payload = {post: {text, post_id: post}, address}
    pushMessage(userChannel, 'new_post', payload).then(() => {})
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
        .then(resp => { dispatch(fav(id)) })
  }
)

const requestUnfavMiddleware = createMiddleware(
  requestUnfav.getType(),
  ({ dispatch, nextDispatch, action }) => {
    nextDispatch(action)
    const id = action.payload
    pushMessage(userChannel, 'unfav', {id})
      .then(resp => { dispatch(unfav(id)) })
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
    dispatch(updateTimeline([]))
    pushMessage(userChannel, 'timeline', {})
      .then(({ posts, favs }) => {
        dispatch(addFavs(favs))
        dispatch(updateTimeline(posts))
      })
  }
)

const openNoticesPageMiddleware = createMiddleware(
  openNoticesPage.getType(),
  ({ dispatch, nextDispatch, action, getState }) => {
    nextDispatch(action)
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
  reloadMiddleware,
  requestUserMiddleware,
  requestPublicTimelineMiddleware
)
