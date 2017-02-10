import { userChannel } from './socket.js'

import { onlinePosts } from './pages.js'
import {
  addNotices, addNewPosts, loadNewPosts,
  addOnlinePosts, addOnlinePostsNotices
} from './actions.js'
import {
  windowFocusedSelector, pageSelector, timelineSelector, userSelector,
  onlinePostsSelector
} from './selectors.js'
import { isDefaultChannel } from './utils.js'

export const watchUserChannel = (store) => {
  userChannel.on('add_notices', payload => {
    store.dispatch(addNotices(payload))
  })
  userChannel.on('add_new_posts', ({posts}) => {
    const state = store.getState()
    if (posts.length == 1
      && userSelector(state).id === posts[0].user.id
      && timelineSelector(state).newPosts.length == 0) {
      store.dispatch(loadNewPosts(posts))
    } else {
      store.dispatch(addNewPosts(posts))
    }
  })
  userChannel.on('add_online_posts', ({posts}) => {
    const state = store.getState()
    const page = pageSelector(state)
    const currentChannel = onlinePostsSelector(state).channel
    const focused = windowFocusedSelector(state)
    const isActive = focused && page.name === onlinePosts.name
    store.dispatch(addOnlinePosts(posts))
    if (!(isActive && isDefaultChannel(currentChannel))) {
      const channels = {}
      posts.forEach(({ channel }) => {
        if (!isActive || channel != currentChannel) {
          if (channels[channel] == null) {
            channels[channel] = 1
          } else {
            channels[channel] += 1
          }
        }
      })
      store.dispatch(addOnlinePostsNotices(channels))
    }
  })
}
