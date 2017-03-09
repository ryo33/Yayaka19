import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import {
  requestOpenedMysteries, setOpenedMysteries
} from '../actions/index.js'

const user = createReducer({
  [setOpenedMysteries]: (state, { user }) => user,
  [requestOpenedMysteries]: () => ({})
}, {})

const openedMysteries = createReducer({
  [setOpenedMysteries]: (state, { mysteries }) => mysteries,
  [requestOpenedMysteries]: () => []
}, [])

const isLoadingOpenedMysteries = createReducer({
  [requestOpenedMysteries]: () => true,
  [setOpenedMysteries]: () => false
}, false)

export default combineReducers({
  user,
  openedMysteries,
  isLoadingOpenedMysteries
})
