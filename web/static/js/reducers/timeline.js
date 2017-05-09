import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import {
  initializeUser,
  requestTimeline, updateTimeline,
  addNewPosts, loadNewPosts,
  requestMoreTimeline, addTimeline,
  requestRemoteTimeline,
  updateRemoteTimeline,
  updateRemoteTimelineStatus
} from '../actions/index.js'
import { compareInsertedAtDesc } from '../utils.js'

const posts = createReducer({
  [requestTimeline]: () => [],
  [updateTimeline]: (state, { posts }) => posts,
  [updateRemoteTimeline]: (state, { posts, host: requestedHost }) => {
    return posts
      .filter(({ host }) => host != requestedHost)
      .concat(state).sort(compareInsertedAtDesc)
  },
  [initializeUser]: (state, { timeline: { posts }}) => posts,
  [addTimeline]: (state, posts) => state.concat(posts),
  [loadNewPosts]: (posts, newPosts) => newPosts.concat(posts).sort(compareInsertedAtDesc)
}, [])

const remotes = createReducer({
  [updateTimeline]: (state, { remotes }) => remotes,
  [initializeUser]: (state, { timeline: { remotes }}) => remotes,
  [updateRemoteTimeline]: (state, { host }) => {
    return Object.assign({}, state, {[host]: 'ok'})
  },
  [requestRemoteTimeline]: (state, host) => {
    return Object.assign({}, state, {[host]: 'loading'})
  },
  [updateRemoteTimelineStatus]: (state, { host, status }) => {
    return Object.assign({}, state, {[host]: status})
  }
}, {})

const newPosts = createReducer({
  [addNewPosts]: (state, posts) => posts.concat(state),
  [loadNewPosts]: () => [],
  [updateTimeline]: () => []
}, [])

const isLoadingTimeline = createReducer({
  [requestTimeline]: () => true,
  [updateTimeline]: () => false
}, false)

const isLoadingMore = createReducer({
  [requestMoreTimeline]: () => true,
  [addTimeline]: () => false
}, false)

export default combineReducers({
  posts, remotes, newPosts, isLoadingTimeline, isLoadingMore
})
