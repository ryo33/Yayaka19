export const infoSelector = ({ info }) => info

export const pageSelector = ({ page }) => page
export const userSelector = ({ user }) => user
export const usersSelector = ({ users }) => users
export const followingSelector = ({ following }) => following
export const followersSelector = ({ followers }) => followers
export const favsSelector = ({ favs }) => favs
export const errorSelector = ({ error }) => error
export const windowFocusedSelector = ({ windowFocused }) => windowFocused

// New post page
export const newPostPageSelector = ({ newPostPage }) => newPostPage

// User
export const userPageSelector = ({ userPage }) => userPage

// Post
export const postPageSelector = ({ postPage }) => postPage

// Online
export const onlinePostsSelector = ({ onlinePosts }) => onlinePosts
export const onlinePostsCountSelector = ({ onlinePosts: { channels }}) => {
  return Object.keys(channels).reduce((acc, channel) => acc + channels[channel], 0)
}

// Public timeline
export const publicTimelineSelector = ({ publicTimeline }) => publicTimeline

// Timeline
export const timelineSelector = ({ timeline }) => timeline

// Notices
export const noticesCountSelctor = ({ notices: { noticed, favs, follows, addresses, replies }}) => {
  if (noticed) {
    return favs.filter(f => f.inserted_at > noticed).length
      + follows.filter(f => f.inserted_at > noticed).length
      + addresses.filter(a => a.inserted_at > noticed).length
      + replies.filter(r => r.inserted_at > noticed).length
  } else {
    return favs.length + follows.length + addresses.length + replies.length
  }
}
