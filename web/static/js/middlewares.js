import { createMiddleware, composeMiddleware } from 'redux-middlewares'

import { pushMessage } from './socket.js'
import { home } from './pages.js'
import { submitPost, updatePostText } from './actions.js'

const submitPostMiddleware = createMiddleware(
  submitPost.getType(),
  ({ dispatch, nextDispatch, action }) => {
    pushMessage('new_post', action.payload)
      .then(() => {
        dispatch(home.action())
        dispatch(updatePostText(''))
      }, ({ error, timeout }) => {
        // TODO
      })
    nextDispatch(action)
  }
)

export default composeMiddleware(
  submitPostMiddleware
)
