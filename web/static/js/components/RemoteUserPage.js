import React, { Component } from 'react'
import { connect } from 'react-redux'
import queryString from 'query-string'

import { requestRemoteUser } from '../actions/index.js'
import RemoteContentForm from './RemoteContentForm.js'
import UserPage from './UserPage.js'

const actionCreators = {
  requestRemoteUser
}

class RemoteUserPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      host: '',
      name: ''
    }
  }

  componentWillMount() {
    const parsed = queryString.parse(location.search)
    this.setState({
      host: parsed.host || '',
      name: parsed.name || ''
    })
  }

  render() {
    const { host, name, opened } = this.state
    return (
      <RemoteContentForm host={host} id={name} placeholder='name'
        onRequest={this.props.requestRemoteUser}>
        <UserPage params={{name}} />
      </RemoteContentForm>
    )
  }
}

export default connect(null, actionCreators)(RemoteUserPage)
