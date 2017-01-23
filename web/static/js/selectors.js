export const infoSelector = ({ info }) => info

export const pageSelector = ({ page }) => page
export const userSelector = ({ user }) => user
export const followingSelector = ({ following }) => following
export const favsSelector = ({ favs }) => favs
export const signedInSelector = ({ user }) => user != null

// Home
export const homePostSelector = ({ home }) => home.post

// New post page
export const newPostPageSelector = ({ newPostPage }) => newPostPage

// User
export const userPageSelector = ({ userPage }) => userPage

// Public timeline
export const publicTimelinePostsSelector = ({ publicTimeline }) => publicTimeline.posts

// Timeline
export const timelinePostsSelector = ({ timeline }) => timeline.posts
