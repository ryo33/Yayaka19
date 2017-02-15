import { createAction } from 'redux-act'

export const requestFollowers = createAction('request followers', user => user)
export const setFollowers = createAction('set followers',
  (user, followers) => ({user, followers}))
