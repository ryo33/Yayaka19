import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { setMysteryInfo, openMystery } from '../actions/index.js'

const mystery = createReducer({
  [setMysteryInfo]: (state, mystery) => mystery,
  [openMystery]: () => null
}, null)

export default combineReducers({
  mystery
})
