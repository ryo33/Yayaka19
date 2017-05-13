import { userChannel } from './socket.js'

import {
  addNotices, addNewPosts, loadNewPosts,
  updateRemoteTimeline,
  updateRemoteTimelineStatus
} from './actions/index.js'
import {
  windowFocusedSelector, pageSelector, timelineSelector, userSelector
} from './selectors.js'
import { isDefaultChannel, isRemoteHost } from './utils.js'

export const watchUserChannel = (store) => {
  userChannel.on('add_notices', payload => {
    store.dispatch(addNotices(payload))
  })
  userChannel.on('add_new_posts', ({posts}) => {
    const state = store.getState()
    if (posts.length == 1
      && userSelector(state).name === posts[0].user.name
      && !isRemoteHost(posts[0].user.host)
      && timelineSelector(state).newPosts.length == 0) {
      store.dispatch(loadNewPosts(posts))
    } else {
      store.dispatch(addNewPosts(posts))
    }
  })
  userChannel.on('remote_timeline', ({host, posts}) => {
    const { newPosts } = timelineSelector(store.getState())
    const filteredPosts = posts.filter(({ id, host }) => {
      return !newPosts.some(({ id: newPostID, host: newPostHost }) => {
        return newPostID == id && newPostHost == host
      })
    })
    store.dispatch(updateRemoteTimeline(host, filteredPosts))
  })
  userChannel.on('remote_timeline_timeout', ({host}) => {
    store.dispatch(updateRemoteTimelineStatus(host, 'timeout'))
  })
  userChannel.on('remote_timeline_error', ({host}) => {
    store.dispatch(updateRemoteTimelineStatus(host, 'error'))
  })
}
