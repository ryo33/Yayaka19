import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { requestPost, setPost, requestContexts, setContexts } from '../actions/index.js'

const post = createReducer({
  [setPost]: (state, post) => post,
  [requestPost]: () => null
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
