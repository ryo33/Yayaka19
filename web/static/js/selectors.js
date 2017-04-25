export const infoSelector = ({ info }) => info

export const pageSelector = ({ page }) => page
export const userSelector = ({ user }) => user
export const usersSelector = ({ users }) => users
export const followingSelector = ({ following }) => following
export const followersSelector = ({ followers }) => followers
export const favsSelector = ({ favs }) => favs
export const errorSelector = ({ error }) => error
export const windowFocusedSelector = ({ windowFocused }) => windowFocused

// New post
export const newPostPageSelector = ({ newPostPage }) => newPostPage
export const editorPluginsSelector = ({ editorPlugins }) => editorPlugins
export const failedPostSelector = ({ failedPost }) => failedPost

// User
export const userPageSelector = ({ userPage }) => userPage

// Followers
export const followersPageSelector = ({ followersPage }) => followersPage

// Following
export const followingPageSelector = ({ followingPage }) => followingPage

// Mysteries
export const mysteriesPageSelector = ({ mysteriesPage }) => mysteriesPage

// Opened mysteries
export const openedMysteriesPageSelector = ({ openedMysteriesPage }) => openedMysteriesPage

// Post
export const postPageSelector = ({ postPage }) => postPage

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

// Mystery
export const mysteryPageSelector = ({ mysteryPage }) => mysteryPage
