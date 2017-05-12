import React, { Component } from 'react'
import { connect } from 'react-redux'
import queryString from 'query-string'

import { requestRemoteMystery } from '../actions/index.js'
import RemoteContentForm from './RemoteContentForm.js'
import MysteryPage from './MysteryPage.js'

const actionCreators = {
  requestRemoteMystery
}

class RemoteMysteryPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      host: '',
      id: ''
    }
  }

  componentWillMount() {
    const parsed = queryString.parse(location.search)
    this.setState({
      host: parsed.host || '',
      id: parsed.id || ''
    })
  }

  render() {
    const { host, id } = this.state
    return (
      <RemoteContentForm host={host} id={id} placeholder='ID'
        onRequest={this.props.requestRemoteMystery}>
        <MysteryPage params={{id}} />
      </RemoteContentForm>
    )
  }
}

export default connect(null, actionCreators)(RemoteMysteryPage)
