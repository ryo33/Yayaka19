import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import {
  initializeUser, updateNoticed, updateNotices, addNotices
} from '../actions.js'

const noticed = createReducer({
  [updateNoticed]: (state, noticed) => noticed,
  [initializeUser]: (state, { noticed }) => noticed
}, null)

const desc = (a, b) => b.id - a.id

const favs = createReducer({
  [updateNotices]: (state, { favs }) => favs,
  [addNotices]: (state, { favs }) => state.concat(favs).sort(desc),
  [initializeUser]: (state, { notices: { favs }}) => favs
}, [])

const follows = createReducer({
  [updateNotices]: (state, { follows }) => follows,
  [addNotices]: (state, { follows }) => state.concat(follows).sort(desc),
  [initializeUser]: (state, { notices: { follows }}) => follows
}, [])

const addresses = createReducer({
  [updateNotices]: (state, { addresses }) => addresses,
  [addNotices]: (state, { addresses }) => state.concat(addresses).sort(desc),
  [initializeUser]: (state, { notices: { addresses }}) => addresses
}, [])

const replies = createReducer({
  [updateNotices]: (state, { replies }) => replies,
  [addNotices]: (state, { replies }) => state.concat(replies).sort(desc),
  [initializeUser]: (state, { notices: { replies }}) => replies
}, [])

export default combineReducers({
  noticed, favs, follows, addresses, replies
})
