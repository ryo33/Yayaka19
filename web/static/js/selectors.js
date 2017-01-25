export const infoSelector = ({ info }) => info

export const pageSelector = ({ page }) => page
export const userSelector = ({ user }) => user
export const followingSelector = ({ following }) => following
export const favsSelector = ({ favs }) => favs

// New post page
export const newPostPageSelector = ({ newPostPage }) => newPostPage

// User
export const userPageSelector = ({ userPage }) => userPage

// Public timeline
export const publicTimelinePostsSelector = ({ publicTimeline }) => publicTimeline.posts

// Timeline
export const timelinePostsSelector = ({ timeline }) => timeline.posts

// Notices
export const favNoticesCountSelctor = ({ notices: { fav, favs }}) => {
  if (fav) {
    return favs.filter(f => f.id > fav).length
  } else {
    return favs.length
  }
}
export const followNoticesCountSelctor = ({ notices: { follow, follows }}) => {
  if (follow) {
    return follows.filter(f => f.id > follow).length
  } else {
    return follows.length
  }
}
export const addressNoticesCountSelctor = ({ notices: { address, addresses }}) => {
  if (address) {
    return addresses.filter(a => a.post_addresses[0].id > address).length
  } else {
    return addresses.length
  }
}
