import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import {
  changeOnlineChannel, addOnlinePosts, addOnlinePostsNotices, showOnlinePosts
} from '../actions.js'
import { DEFAULT_CHANNEL, isDefaultChannel } from '../utils.js'

const posts = createReducer({
  [addOnlinePosts]: (state, posts) => posts.concat(state)
}, [])

const showOnlinePostsReducer = (state, channel) => {
  if (isDefaultChannel(channel)) {
    return {}
  } else if (state[channel] != null) {
    return {
      ...state,
      [channel]: 0
    }
  } else {
    return state
  }
}

const channels = createReducer({
  [addOnlinePostsNotices]: (state, channels) => {
    const nextState = {
      ...state
    }
   Object.keys(channels).forEach(channel => {
      const count = channels[channel]
      if (nextState[channel] == null) {
        nextState[channel] = count
      } else {
        nextState[channel] += count
      }
    })
    return nextState
  },
  [showOnlinePosts]: showOnlinePostsReducer,
  [changeOnlineChannel]: showOnlinePostsReducer
}, {})

const channel = createReducer({
  [changeOnlineChannel]: (state, payload) => payload
}, DEFAULT_CHANNEL)

export default combineReducers({
  posts, channels, channel
})
