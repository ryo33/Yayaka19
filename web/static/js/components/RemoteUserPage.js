import React, { Component } from 'react'
import { connect } from 'react-redux'
import queryString from 'query-string'

import { Button, Segment, Form } from 'semantic-ui-react'

import { requestRemoteUser } from '../actions/index.js'
import UserPage from './UserPage.js'

const actionCreators = {
  requestRemoteUser
}

class RemoteUserPage extends Component {
  constructor(props) {
    super(props)
    this.openRemoteUser = this.openRemoteUser.bind(this)
    this.changeHost = this.changeHost.bind(this)
    this.changeName = this.changeName.bind(this)
    this.state = {
      host: '',
      name: name,
      opened: false
    }
  }

  componentWillMount() {
    const parsed = queryString.parse(location.search)
    this.setState({
      host: parsed.host || '',
      name: parsed.name || ''
    })
  }

  openRemoteUser(event) {
    event.preventDefault()
    const { host, name } = this.state
    if (host.length > 0 && name.length > 0) {
      this.props.requestRemoteUser(host, name)
      this.setState({
        opened: true
      })
    }
  }

  changeHost(event) {
    this.setState({
      opened: false,
      host: event.target.value
    })
  }

  changeName(event) {
    this.setState({
      opened: false,
      name: event.target.value
    })
  }

  render() {
    const { host, name, opened } = this.state
    return (
      <Segment>
        <Segment vertical>
          <Form onSubmit={this.openRemoteUser}>
            <Form.Group>
              <Form.Input placeholder='Host' name='host'
                value={host} onChange={this.changeHost} />
              <Form.Input placeholder='Name' name='name'
                value={name} onChange={this.changeName} />
              <Form.Button content='Request' />
            </Form.Group>
          </Form>
        </Segment>
        {opened ? (
          <UserPage params={{name}} />
        ) : null}
      </Segment>
    )
  }
}

export default connect(null, actionCreators)(RemoteUserPage)
