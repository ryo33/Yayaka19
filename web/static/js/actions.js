import { createAction } from 'redux-act'

export const setUser = createAction('set user', user => user)
export const editUser = createAction('edit user', user => user)
export const setFollowing = createAction('set following', following => following)
export const setFollowers = createAction('set followers', followers => followers)
export const addFavs = createAction('add favs', favs => favs)
export const initializeUser = createAction('initialize user', params => params)
export const setWindowFocused = createAction('set window focused', focused => focused)

// Online
export const addOnlinePosts = createAction('add online posts', (posts, count = 0) => ({ posts, count }))
export const showOnlinePosts = createAction('show online posts')
export const submitOnlinePost = createAction('submit online post', post => post)

// Error
export const showError = createAction('show error', message => message)
export const hideError = createAction('hide error')
export const doPing = createAction('ping')

// Notices page
export const updateNoticed = createAction('update noticed', noticed => noticed)
export const updateNotices = createAction('update notices', notices => notices)
export const openNoticesPage = createAction('open notices')
export const addNotices = createAction('add notices', notices => notices)

// New post page
export const openNewPostDialog = createAction('open new post dialog')
export const closeNewPostDialog = createAction('close new post dialog')
export const updatePostText = createAction('update post text', text => text)
export const updatePostAddress = createAction('update post address', address => address)
export const submitPost = createAction('submit post',
  (text, address, post) => ({text, address, post}))
export const sendToOnline = createAction('send to online', id => id)

// User
export const requestUser = createAction('request user', name => name)
export const setUserInfo = createAction('set user info', info => info)
export const follow = createAction('follow', id => id)
export const unfollow = createAction('unfollow', id => id)
export const requestFollow = createAction('request follow', id => id)
export const requestUnfollow = createAction('request unfollow', id => id)

// Post
export const requestPost = createAction('request post', id => id)
export const setPost = createAction('set post', post => post)

// Public timeline
export const requestPublicTimeline = createAction('request public timeline')
export const updatePublicTimeline = createAction('update public timeline', data => data)

// Timeline
export const requestTimeline = createAction('request timeline')
export const updateTimeline = createAction('update timeline', data => data)
export const addNewPosts = createAction('add new posts', posts => posts)
export const loadNewPosts = createAction('load new posts')

// Fav
export const fav = createAction('fav', id => id)
export const unfav = createAction('unfav', id => id)
export const requestFav = createAction('request fav', id => id)
export const requestUnfav = createAction('request unfav', id => id)
