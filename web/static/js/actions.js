import { createAction } from 'redux-act'

export const setUser = createAction('set user', user => user)
export const setFollowing = createAction('set following', following => following)
export const addFavs = createAction('add favs', favs => favs)

// Notices
export const updateNoticed = createAction('update noticed', noticed => noticed)
export const updateNotices = createAction('update notices', notices => notices)
export const openNoticesPage = createAction('open notices')
export const addNotices = createAction('add notices', notices => notices)

// New post page
export const updatePostAddress = createAction('update post address', address => address)
export const submitPost = createAction('submit post',
  (text, address, post) => ({text, address, post}))

// User
export const requestUser = createAction('request user', name => name)
export const setUserInfo = createAction('set user info', info => info)
export const follow = createAction('follow', id => id)
export const unfollow = createAction('unfollow', id => id)
export const requestFollow = createAction('request follow', id => id)
export const requestUnfollow = createAction('request unfollow', id => id)

// Public timeline
export const requestPublicTimeline = createAction('request public timeline')
export const updatePublicTimeline = createAction('update public timeline', data => data)

// Timeline
export const requestTimeline = createAction('request timeline')
export const updateTimeline = createAction('update timeline', data => data)
export const addNewPosts = createAction('add new posts', posts => posts)
export const loadNewPosts = createAction('load new posts')

export const fav = createAction('fav', id => id)
export const unfav = createAction('unfav', id => id)
export const requestFav = createAction('request fav', id => id)
export const requestUnfav = createAction('request unfav', id => id)
