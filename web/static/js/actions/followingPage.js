import { createAction } from 'redux-act'

export const requestFollowing = createAction('request following', user => user)
export const setFollowing = createAction('set following',
  (user, following) => ({user, following}))
