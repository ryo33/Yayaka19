import { createAsyncHook, createReplacer, composeMiddleware } from 'redux-middlewares'

import { signedIn } from '../global.js'
import { pushMessage, channel, userChannel } from '../socket.js'
import {
  loginPage, home, timeline, publicTimeline, userPage
} from '../pages.js'
import {
  editUser, setUser, initializeUser,
  submitPost, updatePostText,
  saveFailedPost, resubmitFailedPost,
  requestUser, setUserInfo, requestRemoteUser,
  requestMoreUserPosts, addUserPosts,
  requestPost, setPost, requestContexts, setContexts,
  requestFollow, requestUnfollow, follow, unfollow,
  requestFav, requestUnfav, fav, unfav,
  requestPublicTimeline, updatePublicTimeline,
  requestTimeline, updateTimeline, addFavs,
  requestMoreTimeline, addTimeline,
  openNoticesPage, updateNoticed,
  showError, hideError, doPing,
  closeNewPostDialog,
  setWindowFocused
} from '../actions/index.js'
import { pageSelector, onlinePostsSelector } from '../selectors.js'
import { compareInsertedAtDesc, compareNotices, isRemoteHost } from '../utils.js'
import followersPageMiddleware from './followersPage.js'
import followingPageMiddleware from './followingPage.js'
import followingServersPageMiddleware from './followingServersPage.js'
import mysteriesPageMiddleware from './mysteriesPage.js'
import openedMysteriesPageMiddleware from './openedMysteriesPage.js'
import mysteryPageMiddleware from './mysteryPage.js'

const redirectLoginPageMiddleware = createReplacer(
  () => !signedIn, [
    requestFollow.getType(),
    requestFav.getType(),
    submitPost.getType()],
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
    const payload = {text, address, post}
    pushMessage(userChannel, 'new_post', payload)
      .then(() => {})
      .catch(() => {
        dispatch(saveFailedPost(payload))
      })
  }
)

const resubmitFailedPostMiddleware = createAsyncHook(
  resubmitFailedPost.getType(),
  ({ dispatch, getState, action }) => {
    const { payload } = action
    pushMessage(userChannel, 'new_post', payload)
      .then(() => {})
      .catch(() => {
        dispatch(saveFailedPost(payload))
      })
  }
)

const requestUserMiddleware = createAsyncHook(
  requestUser.getType(),
  ({ dispatch, action }) => {
    setUserInfo({})
    pushMessage(channel, 'user_info', {name: action.payload})
      .then(resp => {
        const { user, posts, favs, postCount, following, followers, mysteries, openedMysteries } = resp
        dispatch(addFavs(favs))
        dispatch(setUserInfo({user, posts, postCount, following, followers, mysteries, openedMysteries}))
      }, ({ error, timeout }) => {
        dispatch(home.action())
      })
  }
)

const requestRemoteUserMiddleware = createAsyncHook(
  requestRemoteUser.getType(),
  ({ dispatch, action }) => {
    setUserInfo({})
    const { host, name } = action.payload
    pushMessage(channel, 'remote_user_info', {host, name})
      .then(resp => {
        const { user, posts, favs, postCount, following, followers, mysteries, openedMysteries } = resp
        dispatch(addFavs(favs))
        dispatch(setUserInfo({user, posts, postCount, following, followers, mysteries, openedMysteries}))
      }, ({ error, timeout }) => {
        dispatch(home.action())
      })
  }
)

const requestMoreUserPostsMiddleware = createAsyncHook(
  requestMoreUserPosts.getType(),
  ({ dispatch, action }) => {
    pushMessage(channel, 'more_user_posts', action.payload)
      .then(({ posts, favs }) => {
        dispatch(addFavs(favs))
        dispatch(addUserPosts(posts))
      })
      .catch(() => {})
  }
)

const requestPostMiddleware = createAsyncHook(
  requestPost.getType(),
  ({ dispatch, action }) => {
    setPost(null)
    pushMessage(channel, 'post', {id: action.payload})
      .then(({ post, favs }) => {
        dispatch(addFavs(favs))
        dispatch(setPost(post))
      }, ({ error, timeout }) => {
        dispatch(home.action())
      })
  }
)

const requestContextsMiddleware = createAsyncHook(
  requestContexts.getType(),
  ({ dispatch, action }) => {
    setContexts(null)
    pushMessage(channel, 'post_contexts', {id: action.payload})
      .then(({ posts, favs }) => {
        dispatch(addFavs(favs))
        dispatch(setContexts(posts))
      }, ({ error, timeout }) => {})
  }
)

const requestFollowMiddleware = createAsyncHook(
  requestFollow.getType(),
  ({ dispatch, action }) => {
    const { name, host } = action.payload
    pushMessage(userChannel, 'follow', {name, host})
      .then(resp => {
        if (isRemoteHost(host)) {
          dispatch(follow(name, host))
        } else {
          dispatch(follow(name))
        }
      }).catch(() => {
        dispatch(showError('Failed to follow.'))
      })
  }
)

const requestUnfollowMiddleware = createAsyncHook(
  requestUnfollow.getType(),
  ({ dispatch, action }) => {
    const { name, host } = action.payload
    pushMessage(userChannel, 'unfollow', {name, host})
      .then(resp => {
        if (isRemoteHost(host)) {
          dispatch(unfollow(name, host))
        } else {
          dispatch(unfollow(name))
        }
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
    pushMessage(channel, 'public_timeline', {})
      .then(({ posts, favs, hosts }) => {
        posts.sort(compareInsertedAtDesc)
        dispatch(addFavs(favs))
        dispatch(updatePublicTimeline({hosts, posts}))
      }).catch(() => {
        dispatch(showError('Failed to fetch the public timeline.'))
      })
  }
)

const requestTimelineMiddleware = createAsyncHook(
  requestTimeline.getType(),
  ({ dispatch, action }) => {
    pushMessage(userChannel, 'timeline', {})
      .then(({ posts, favs, remotes }) => {
        dispatch(addFavs(favs))
        dispatch(updateTimeline(posts, remotes))
      }).catch(() => {
        dispatch(showError('Failed to fetch the timeline.'))
      })
  }
)

const requestMoreTimelineMiddleware = createAsyncHook(
  requestMoreTimeline.getType(),
  ({ dispatch, action }) => {
    const id = action.payload
    pushMessage(userChannel, 'more_timeline', {id})
      .then(({ posts, favs }) => {
        dispatch(addFavs(favs))
        dispatch(addTimeline(posts))
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

let signedInMiddlewares = []
if (signedIn) {
  signedInMiddlewares = [
    submitPostMiddleware,
    resubmitFailedPostMiddleware,
    requestFollowMiddleware,
    requestUnfollowMiddleware,
    requestFavMiddleware,
    requestUnfavMiddleware,
    requestTimelineMiddleware,
    requestMoreTimelineMiddleware,
    openNoticesPageMiddleware,
    editUserMiddleware
  ]
}

export default composeMiddleware(
  followersPageMiddleware,
  followingPageMiddleware,
  followingServersPageMiddleware,
  mysteriesPageMiddleware,
  openedMysteriesPageMiddleware,
  mysteryPageMiddleware,
  ...signedInMiddlewares,
  redirectLoginPageMiddleware,
  requestUserMiddleware,
  requestRemoteUserMiddleware,
  requestMoreUserPostsMiddleware,
  requestPostMiddleware,
  requestContextsMiddleware,
  requestPublicTimelineMiddleware,
  doPingMiddleware
)
