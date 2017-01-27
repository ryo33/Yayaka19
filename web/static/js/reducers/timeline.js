import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import concatenateReducers from 'redux-concatenate-reducers'

import { updateTimeline, addNewPosts, loadNewPosts } from '../actions.js'

const postsReducer = createReducer({
  [updateTimeline]: ({posts: state}, posts) => ({posts})
}, {posts: []})

const newPostsReducer = createReducer({
  [addNewPosts]: ({newPosts: state}, posts) => ({newPosts: posts.concat(state)})
}, {newPosts: []})

const loadReducer = createReducer({
  [loadNewPosts]: ({ posts, newPosts }, payload) => ({
    posts: newPosts.concat(posts),
    newPosts: []
  })
}, {})

export default concatenateReducers([
  postsReducer,
  newPostsReducer,
  loadReducer
])
