export const infoSelector = ({ info }) => info

export const pageSelector = ({ page }) => page
export const userSelector = ({ user }) => user
export const followingSelector = ({ following }) => following
export const favsSelector = ({ favs }) => favs
export const errorSelector = ({ error }) => error

// New post page
export const newPostPageSelector = ({ newPostPage }) => newPostPage

// User
export const userPageSelector = ({ userPage }) => userPage

// Post
export const postPageSelector = ({ postPage }) => postPage

// Public timeline
export const publicTimelinePostsSelector = ({ publicTimeline }) => publicTimeline.posts

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
