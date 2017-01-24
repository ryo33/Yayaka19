import { createAction } from 'redux-act'

export const requestInfo = createAction('request info')
export const updateInfo = createAction('update info', info => info)

export const setUser = createAction('set user', user => user)
export const setFollowing = createAction('set following', following => following)
export const addFavs = createAction('add favs', favs => favs)

export const reload = createAction('reload')

// Notices
export const setCurrentNotices = createAction('set current notices', notices => notices)
export const updateNotices = createAction('update notices', notices => notices)
export const openFavNotices = createAction('open fav notices')
export const openFollowNotices = createAction('open follow notices')
export const openAddressNotices = createAction('open address notices')

// Home
export const requestRandomPost = createAction('request random post')
export const setHomePost = createAction('set home post', post => post)

// New post page
export const updatePostText = createAction('update post text', text => text)
export const updatePostAddress = createAction('update post address', address => address)
export const submitPost = createAction('submit post', (text, address) => ({text, address}))

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

export const fav = createAction('fav', id => id)
export const unfav = createAction('unfav', id => id)
export const requestFav = createAction('request fav', id => id)
export const requestUnfav = createAction('request unfav', id => id)
