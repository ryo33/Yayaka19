import { createAction } from 'redux-act'

export const setUser = createAction('set user', user => user)

export const requestRandomPost = createAction('request random post')
export const requestTimeline = createAction('request timeline')
export const requestPublicTimeline = createAction('request public timeline')
export const requestUser = createAction('request user', id => id)

export const updatePostText = createAction('update post text', text => text)
export const submitPost = createAction('submit post', text => ({text}))
