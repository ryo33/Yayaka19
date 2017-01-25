import React from 'react'
import { connect } from 'react-redux'

import { Button } from 'semantic-ui-react'

import { reload } from '../actions.js'

const actionCreators = {
  reload
}

const ReloadButton = ({ reload }) => (
  <Button onClick={reload}>Reload</Button>
)

export default connect(null, actionCreators)(ReloadButton)
