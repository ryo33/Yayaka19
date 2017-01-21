export const pageSelector = ({ page }) => page
export const userSelector = ({ user }) => user
export const followingSelector = ({ following }) => following
export const signedInSelector = ({ user }) => user != null

// Home
export const homePostSelector = ({ home }) => home.post

// New post page
export const newPostPageSelector = ({ newPostPage }) => newPostPage

// User
export const userPageSelector = ({ userPage }) => userPage
