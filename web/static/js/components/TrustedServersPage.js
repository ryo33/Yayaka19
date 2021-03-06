import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Segment, Menu, Form, Input, Button, Icon, Header } from 'semantic-ui-react'

import UserID from './UserID.js'
import { userPage } from '../pages.js'
import {
  userSelector, trustedServersPageSelector, followingServersSelector
} from '../selectors.js'
import { requestTrustServer, requestUntrustServer } from '../actions/index.js'

const mapStateToProps = state => {
  const user = userSelector(state)
  const { user: pageUser, trustedServers } = trustedServersPageSelector(state)
  const hosts = trustedServers.map(({ host }) => host)
  const following = followingServersSelector(state).filter(host => !hosts.includes(host))
  return {
    isMe: user && pageUser && user.id === pageUser.id,
    hosts, following, pageUser, trustedServers
  }
}

const actionCreators = {
  requestTrustServer,
  requestUntrustServer,
  userPageAction: (name) => userPage.action({name})
}

class TrustServerForm extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.trust = this.trust.bind(this)
    this.state = {
      host: ''
    }
  }

  handleChange(event) {
    this.setState({
      host: event.target.value
    })
  }

  trust(event) {
    event.preventDefault()
    this.props.trust(this.state.host)
    this.setState({
      host: ''
    })
  }

  render() {
    const { host } = this.state
    return (
      <Segment>
        <Form onSubmit={this.trust}>
          <Form.Group inline>
            <Form.Input placeholder='Host' name='host'
              value={host} onChange={this.handleChange} />
            <Form.Button primary content='Trust' />
          </Form.Group>
        </Form>
      </Segment>
    )
  }
}

class TrustedServersPage extends Component {
  constructor(props) {
    super(props)
    this.trustServer = this.trustServer.bind(this)
  }

  trustServer(host) {
    const { hosts } = this.props
    if (host.length >= 1 && !hosts.includes(host)) {
      this.props.requestTrustServer(host)
    }
  }

  untrustServer(id) {
    this.props.requestUntrustServer(id)
  }

  render() {
    const { isMe, following, pageUser, trustedServers, userPageAction } = this.props
    return (
      <div>
        <Segment vertical>
          <Header>{pageUser.display}'s Trusted Servers</Header>
          <Menu secondary>
            <Menu.Item href={userPage.path({name: pageUser.name})}
              onClick={(e) => { e.preventDefault(); userPageAction(pageUser.name) }}>
              {pageUser.display} <UserID user={pageUser} />
            </Menu.Item>
          </Menu>
          {isMe ? (
            <TrustServerForm trust={this.trustServer} />
          ) : null}
        </Segment>
        {following.length >= 1 ? (
        <Segment vertical>
          <Header>Your Following Servers</Header>
          {
            following.map(host => {
              return (
                <Button primary key={host} onClick={() => this.props.requestTrustServer(host)}>
                  Trust {host}
                </Button>
              )
            })
          }
        </Segment>
        ) : null}
        {
          trustedServers.map(({ id, host }) => (
            <Segment key={id} vertical>
              <Menu secondary>
                <Menu.Item>{host}</Menu.Item>
                {isMe ? (
                  <Menu.Item>
                    <Button icon='remove' onClick={() => this.untrustServer(id)} />
                  </Menu.Item>
                ) : null}
              </Menu>
            </Segment>
          ))
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(TrustedServersPage)
