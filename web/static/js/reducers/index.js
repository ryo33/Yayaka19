import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import { createPagesReducer } from 'redux-pages'

import { home } from '../pages.js'
import { setUser, setFollowing, follow, unfollow } from '../actions.js'

import homeReducer from './home.js'
import newPostPage from './newPostPage.js'
import userPage from './userPage.js'

const page = createPagesReducer(home.name, {})

const user = createReducer({
  [setUser]: (state, payload) => payload
}, null)

const following = createReducer({
  [setFollowing]: (state, payload) => payload,
  [follow]: (state, id) => [id, ...state],
  [unfollow]: (state, unfollowID) => state.filter(id => id !== unfollowID),
}, [])

export default combineReducers({
  page,
  user,
  following,
  home: homeReducer,
  newPostPage,
  userPage
})
