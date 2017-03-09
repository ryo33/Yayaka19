import { createAsyncHook, composeMiddleware } from 'redux-middlewares'

import { pushMessage, userChannel } from '../socket.js'
import { openMystery, setMysteryInfo, submitMystery } from '../actions/index.js'
import { mysteryPage } from '../pages.js'

const openMysteryMiddleware = createAsyncHook(
  openMystery.getType(),
  ({ dispatch, action }) => {
    const id = action.payload
    pushMessage(userChannel, 'open_mystery', {id})
      .then(({ mystery, text }) => {
        dispatch(setMysteryInfo(Object.assign(mystery, {text})))
      })
      .catch(() => {})
  }
)

const submitMysteryMiddleware = createAsyncHook(
  submitMystery.getType(),
  ({ dispatch, action }) => {
    const params = action.payload
    pushMessage(userChannel, 'new_mystery', params)
      .then(({ mystery }) => {
        dispatch(mysteryPage.action({id: mystery.id}))
      })
  }
)

export default composeMiddleware(
  openMysteryMiddleware,
  submitMysteryMiddleware
)
