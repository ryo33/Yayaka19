import { createAction } from 'redux-act'

export const setUser = createAction('set user', user => user)
export const editUser = createAction('edit user', user => user)
export const setFollowing = createAction('set following', following => following)
export const setFollowers = createAction('set followers', followers => followers)
export const addFavs = createAction('add favs', favs => favs)
export const initializeUser = createAction('initialize user', params => params)
export const setWindowFocused = createAction('set window focused', focused => focused)

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
export const saveFailedPost = createAction('save failed post', p => p)
export const resubmitFailedPost = createAction('resubmit failed post', p => p)
export const dismissFailedPost = createAction('dismiss failed post')

// User
export const requestUser = createAction('request user', name => name)
export const setUserInfo = createAction('set user info', info => info)
export const follow = createAction('follow', (name, host) => ({name, host}))
export const unfollow = createAction('unfollow', (name, host) => ({name, host}))
export const requestFollow = createAction('request follow', (name, host) => ({name, host}))
export const requestUnfollow = createAction('request unfollow', (name, host) => ({name, host}))
export const requestMoreUserPosts = createAction('request more user posts', (user, id) => ({user, id}))
export const addUserPosts = createAction('add user posts', posts => posts)

// Remote
export const requestRemoteUser = createAction('request remote user',
  (host, name) => ({host, name}))

// Mysteries
export const requestMysteries = createAction('request mysteries', name => name)
export const setMysteries = createAction('set mysteries', (user, mysteries) => ({user, mysteries}))
export const requestOpenedMysteries = createAction('request opened mysteries', name => name)
export const setOpenedMysteries = createAction('set opened mysteries', (user, mysteries) => ({user, mysteries}))

// Post
export const requestPost = createAction('request post', id => id)
export const setPost = createAction('set post', post => post)
export const requestContexts = createAction('request contexts', id => id)
export const setContexts = createAction('set contexts', contexts => contexts)

// Public timeline
export const requestPublicTimeline = createAction('request public timeline')
export const updatePublicTimeline = createAction('update public timeline', data => data)

// Timeline
export const requestTimeline = createAction('request timeline')
export const updateTimeline = createAction('update timeline',
  (posts, remotes) => ({posts, remotes}))
export const updateRemoteTimeline = createAction('update remote timeline',
  (host, posts) => ({host, posts}))
export const updateRemoteTimelineStatus = createAction('update remote timeline status',
  (host, status) => ({host, status}))
export const addNewPosts = createAction('add new posts', posts => posts)
export const loadNewPosts = createAction('load new posts', posts => posts)
export const requestMoreTimeline = createAction('request more timeline', id => id)
export const addTimeline = createAction('add timeline', posts => posts)

// Fav
export const fav = createAction('fav', id => id)
export const unfav = createAction('unfav', id => id)
export const requestFav = createAction('request fav', id => id)
export const requestUnfav = createAction('request unfav', id => id)

// Mystery
export const openMystery = createAction('open mystery', id => id)
export const setMysteryInfo = createAction('set mystery', mystery => mystery)
export const submitMystery = createAction('submit mystery', mystery => mystery)

// Following Servers
export const requestFollowingServers = createAction('request following servers', name => name)
export const setFollowingServers = createAction('set following servers',
  (user, followingServers) => ({user, followingServers}))
export const requestFollowServer = createAction('request follow server', host => host)
export const requestUnfollowServer = createAction('request unfollow server', host => host)
export const followServer = createAction('follow server', server => server)
export const unfollowServer = createAction('unfollow server', id => id)
