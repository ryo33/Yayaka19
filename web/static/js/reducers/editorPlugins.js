import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { updatePlugins } from '../actions/editorPlugins.js'

const plugins = createReducer({
  [updatePlugins]: (state, plugins) => plugins
}, [])

export default combineReducers({
  plugins
})
