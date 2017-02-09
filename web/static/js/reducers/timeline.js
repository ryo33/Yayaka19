import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import {
  initializeUser, updateTimeline, addNewPosts, loadNewPosts,
  requestMoreTimeline, addTimeline
} from '../actions.js'

const posts = createReducer({
  [updateTimeline]: (state, posts) => posts,
  [initializeUser]: (state, { timeline: { posts }}) => posts,
  [addTimeline]: (state, posts) => state.concat(posts),
  [loadNewPosts]: (posts, newPosts) => newPosts.concat(posts)
}, [])

const newPosts = createReducer({
  [addNewPosts]: (state, posts) => posts.concat(state),
  [loadNewPosts]: () => []
}, [])

const isLoadingMore = createReducer({
  [requestMoreTimeline]: () => true,
  [addTimeline]: () => false
}, false)

export default combineReducers({
  posts, newPosts, isLoadingMore
})
