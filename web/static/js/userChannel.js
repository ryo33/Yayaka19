import { userChannel } from './socket.js'

import { onlinePosts } from './pages.js'
import {
  addNotices, addNewPosts, loadNewPosts,
  addOnlinePosts, showOnlinePosts
} from './actions.js'
import { pageSelector, timelineSelector, userSelector } from './selectors.js'

export const watchUserChannel = (store) => {
  userChannel.on('add_notices', payload => {
    store.dispatch(addNotices(payload))
  })
  userChannel.on('add_new_posts', ({posts}) => {
    const state = store.getState()
    if (posts.length == 1
      && userSelector(state).id === posts[0].user.id
      && timelineSelector(state).newPosts.length == 0) {
      store.dispatch(addNewPosts(posts))
      store.dispatch(loadNewPosts())
    } else {
      store.dispatch(addNewPosts(posts))
    }
  })
  userChannel.on('add_online_posts', ({posts}) => {
    const state = store.getState()
    const page = pageSelector(state)
    const count = page.name !== onlinePosts.name ? posts.length : 0
    store.dispatch(addOnlinePosts(posts, count))
  })
}
