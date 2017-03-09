import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import {
  requestMysteries, setMysteries
} from '../actions/index.js'

const user = createReducer({
  [setMysteries]: (state, { user }) => user,
  [requestMysteries]: () => ({})
}, {})

const mysteries = createReducer({
  [setMysteries]: (state, { mysteries }) => mysteries,
  [requestMysteries]: () => []
}, [])

const isLoadingMysteries = createReducer({
  [requestMysteries]: () => true,
  [setMysteries]: () => false
}, false)

export default combineReducers({
  user,
  mysteries,
  isLoadingMysteries
})
