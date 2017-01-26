import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { updateNoticed, updateNotices, addNotices } from '../actions.js'

const noticed = createReducer({
  [updateNoticed]: (state, noticed) => noticed
}, null)

const desc = (a, b) => b.id - a.id

const favs = createReducer({
  [updateNotices]: (state, { favs }) => favs,
  [addNotices]: (state, { favs }) => state.concat(favs).sort(desc)
}, [])

const follows = createReducer({
  [updateNotices]: (state, { follows }) => follows,
  [addNotices]: (state, { follows }) => state.concat(follows).sort(desc)
}, [])

const addresses = createReducer({
  [updateNotices]: (state, { addresses }) => addresses,
  [addNotices]: (state, { addresses }) => state.concat(addresses).sort(desc)
}, [])

const replies = createReducer({
  [updateNotices]: (state, { replies }) => replies,
  [addNotices]: (state, { replies }) => state.concat(replies).sort(desc)
}, [])

export default combineReducers({
  noticed, favs, follows, addresses, replies
})
