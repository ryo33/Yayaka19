import { createAsyncHook, createReplacer, composeMiddleware } from 'redux-middlewares'

import { signedIn } from './global.js'
import { pushMessage, channel, userChannel } from './socket.js'
import {
  loginPage, home, timeline, publicTimeline, userPage
} from './pages.js'
import {
  editUser, setUser, initializeUser,
  submitOnlinePost,
  submitPost, updatePostText,
  requestUser, setUserInfo,
  requestPost, setPost,
  requestFollow, requestUnfollow, follow, unfollow,
  requestFav, requestUnfav, fav, unfav,
  requestPublicTimeline, updatePublicTimeline,
  requestTimeline, updateTimeline, addFavs,
  openNoticesPage, updateNoticed,
  showError, hideError, doPing,
  closeNewPostDialog
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
  ({ dispatch, getState, action }) => {
    const state = getState()
    const page =  pageSelector(state)
    if (page.name !== timeline.name && page.name !== publicTimeline.name) {
      dispatch(closeNewPostDialog())
    }
    const { text, address, post } = action.payload
    const payload = {post: {text, post_id: post}, address}
    pushMessage(userChannel, 'new_post', payload)
      .then(() => {})
      .catch(() => {
        dispatch(showError('Failed to submit.'))
      })
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

const requestPostMiddleware = createAsyncHook(
  requestPost.getType(),
  ({ dispatch, action }) => {
    setPost(null)
    pushMessage(channel, 'post', {id: action.payload})
      .then(({ post }) => {
        dispatch(setPost(post))
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
      }).catch(() => {
        dispatch(showError('Failed to follow.'))
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
      }).catch(() => {
        dispatch(showError('Failed to unfollow.'))
      })
  }
)

const requestFavMiddleware = createAsyncHook(
  requestFav.getType(),
  ({ dispatch, action }) => {
    const id = action.payload
      pushMessage(userChannel, 'fav', {id})
        .then(resp => { dispatch(fav(id)) })
        .catch(() => {
          dispatch(showError('Failed to fav.'))
        })
  }
)

const requestUnfavMiddleware = createAsyncHook(
  requestUnfav.getType(),
  ({ dispatch, action }) => {
    const id = action.payload
    pushMessage(userChannel, 'unfav', {id})
      .then(resp => { dispatch(unfav(id)) })
      .catch(() => {
        dispatch(showError('Failed to unfav.'))
      })
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
      }).catch(() => {
        dispatch(showError('Failed to fetch the public timeline.'))
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
      }).catch(() => {
        dispatch(showError('Failed to fetch the timeline.'))
      })
  }
)

const openNoticesPageMiddleware = createAsyncHook(
  openNoticesPage.getType(),
  ({ dispatch, action, getState }) => {
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
  }
)

const editUserMiddleware = createAsyncHook(
  editUser.getType(),
  ({ dispatch, action }) => {
    const user = action.payload
    pushMessage(userChannel, 'edit', {user})
      .then(({ user }) => {
        dispatch(setUser(user))
        dispatch(userPage.action({name: user.name}))
      }).catch(({ user }) => {
        dispatch(userPage.action({name: user.name}))
      })
  }
)

const doPingMiddleware = createAsyncHook(
  doPing.getType(),
  () => {
    pushMessage(channel, 'ping')
      .then(() => {})
  }
)

const submitOnlinePostMiddleware = createAsyncHook(
  submitOnlinePost.getType(),
  ({ action }) => {
    const { text } = action.payload
    pushMessage(userChannel, 'online_post', {text})
      .then(() => {/* TODO */})
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
  requestPostMiddleware,
  requestPublicTimelineMiddleware,
  editUserMiddleware,
  submitOnlinePostMiddleware,
  doPingMiddleware
)
