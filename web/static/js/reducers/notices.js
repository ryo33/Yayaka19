import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { setCurrentNotices, updateNotices, addNotices } from '../actions.js'

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
  [updateNotices]: (state, { favs }) => favs,
  [addNotices]: (state, { favs }) => state.concat(favs).sort((a, b) => b.id - a.id) // DESC
}, [])

const follows = createReducer({
  [updateNotices]: (state, { follows }) => follows,
  [addNotices]: (state, { follows }) => state.concat(follows).sort((a, b) => b.id - a.id) // DESC
}, [])

const addresses = createReducer({
  [updateNotices]: (state, { addresses }) => addresses,
  [addNotices]: (state, { addresses }) => state.concat(addresses).sort((a, b) => b.id - a.id) // DESC
}, [])

export default combineReducers({
  fav, follow, address,
  favs, follows, addresses
})
