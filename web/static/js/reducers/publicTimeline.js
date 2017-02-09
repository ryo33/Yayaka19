import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { requestPublicTimeline, updatePublicTimeline } from '../actions.js'

const posts = createReducer({
  [requestPublicTimeline]: () => [],
  [updatePublicTimeline]: (state, { posts }) => posts
}, [])

const isLoadingPublicTimeline = createReducer({
  [requestPublicTimeline]: () => true,
  [updatePublicTimeline]: () => false
}, false)

export default combineReducers({
  posts, isLoadingPublicTimeline
})
