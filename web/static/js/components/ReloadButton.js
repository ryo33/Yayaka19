import React from 'react'
import { connect } from 'react-redux'

import { reload } from '../actions.js'

const actionCreators = {
  reload
}

const ReloadButton = ({ reload }) => (
  <button className="reload" onClick={reload}>Reload</button>
)

export default connect(null, actionCreators)(ReloadButton)
