import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { setCurrentNotices, updateNotices } from '../actions.js'

const fav = createReducer({
  [setCurrentNotices]: (state, { fav }) => fav
}, null)

const follow = createReducer({
  [setCurrentNotices]: (state, { follow }) => follow
}, null)

const address = createReducer({
  [setCurrentNotices]: (state, { address }) => address
}, null)

const favs = createReducer({
  [updateNotices]: (state, { favs }) => favs
}, [])

const follows = createReducer({
  [updateNotices]: (state, { follows }) => follows
}, [])

const addresses = createReducer({
  [updateNotices]: (state, { addresses }) => addresses
}, [])

export default combineReducers({
  fav, follow, address,
  favs, follows, addresses
})
