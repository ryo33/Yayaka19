import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import {
  requestUser, setUserInfo, requestMoreUserPosts, addUserPosts,
  requestRemoteUser, setRemoteUserInfo
} from '../actions/index.js'

const user = createReducer({
  [setUserInfo]: (state, { user = null }) => user,
  [requestUser]: () => null,
  [setRemoteUserInfo]: (state, { user = null }) => user,
  [requestRemoteUser]: () => null
}, null)

const postCount = createReducer({
  [setUserInfo]: (state, { postCount = 0 }) => postCount,
  [setRemoteUserInfo]: (state, { postCount = 0 }) => postCount
}, 0)

const following = createReducer({
  [setUserInfo]: (state, { following = 0 }) => following,
  [setRemoteUserInfo]: (state, { following = 0 }) => following
}, 0)

const followers = createReducer({
  [setUserInfo]: (state, { followers = 0 }) => followers,
  [setRemoteUserInfo]: (state, { followers = 0 }) => followers
}, 0)

const mysteries = createReducer({
  [setUserInfo]: (state, { mysteries = 0 }) => mysteries,
  [setRemoteUserInfo]: (state, { mysteries = 0 }) => mysteries
}, 0)

const openedMysteries = createReducer({
  [setUserInfo]: (state, { openedMysteries = 0 }) => openedMysteries,
  [setRemoteUserInfo]: (state, { openedMysteries = 0 }) => openedMysteries
}, 0)

const posts = createReducer({
  [setUserInfo]: (state, { posts = [] }) => posts,
  [setRemoteUserInfo]: (state, { posts = [] }) => posts,
  [addUserPosts]: (state, posts) => state.concat(posts)
}, null)

const isLoadingMorePosts = createReducer({
  [requestMoreUserPosts]: () => true,
  [addUserPosts]: () => false
}, false)

export default combineReducers({
  user,
  postCount,
  following,
  followers,
  mysteries,
  openedMysteries,
  posts,
  isLoadingMorePosts
})
