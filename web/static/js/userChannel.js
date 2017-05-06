import { userChannel } from './socket.js'

import {
  addNotices, addNewPosts, loadNewPosts,
  updateRemoteTimeline,
  updateRemoteTimelineStatus
} from './actions/index.js'
import {
  windowFocusedSelector, pageSelector, timelineSelector, userSelector
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
  userChannel.on('remote_timeline', ({host, posts}) => {
    store.dispatch(updateRemoteTimeline(host, posts))
  })
  userChannel.on('remote_timeline_timeout', ({host}) => {
    store.dispatch(updateRemoteTimelineStatus(host, 'timeout'))
  })
  userChannel.on('remote_timeline_error', ({host}) => {
    store.dispatch(updateRemoteTimelineStatus(host, 'error'))
  })
  userChannel.on('add_remote_posts', ({posts}) => {
    store.dispatch(addNewPosts(posts))
  })
}
