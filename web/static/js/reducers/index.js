import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import { createPagesReducer } from 'redux-pages'

import { home } from '../pages.js'
import { setUser } from '../actions.js'

import newPostPage from './newPostPage.js'

const page = createPagesReducer(home.name, {})

const user = createReducer({
  [setUser]: (state, payload) => payload
}, null)

export default combineReducers({
  page,
  user,
  newPostPage
})
