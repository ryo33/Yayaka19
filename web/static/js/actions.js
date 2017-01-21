import { createAction } from 'redux-act'

export const setUser = createAction('set user', user => user)
export const setFollowing = createAction('set following', following => following)

export const requestRandomPost = createAction('request random post')
export const requestTimeline = createAction('request timeline')
export const requestPublicTimeline = createAction('request public timeline')
export const requestUser = createAction('request user', name => name)

// Home
export const setHomePost = createAction('set home post', post => post)

// New post page
export const updatePostText = createAction('update post text', text => text)
export const submitPost = createAction('submit post', text => ({text}))

// User
export const setUserInfo = createAction('set user info', info => info)
export const follow = createAction('follow', id => id)
export const unfollow = createAction('unfollow', id => id)
