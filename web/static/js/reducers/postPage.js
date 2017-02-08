import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { setPost, requestContexts, setContexts } from '../actions.js'

const post = createReducer({
  [setPost]: (state, post) => post
}, null)

const isLoadingContexts = createReducer({
  [requestContexts]: () => true,
  [setContexts]: () => false
}, false)

const contexts = createReducer({
  [setContexts]: (state, contexts) => contexts
}, null)

export default combineReducers({
  post, isLoadingContexts, contexts
})
