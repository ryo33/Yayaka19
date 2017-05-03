import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Segment, Menu, Input, Button, Icon, Header } from 'semantic-ui-react'

import UserID from './UserID.js'
import { userPage } from '../pages.js'
import { userSelector, followingServersPageSelector } from '../selectors.js'
import { requestFollowServer, requestUnfollowServer } from '../actions/index.js'

const mapStateToProps = state => {
  const user = userSelector(state)
  const { user: pageUser, followingServers } = followingServersPageSelector(state)
  return {
    isMe: user && pageUser && user.id === pageUser.id,
    hosts: followingServers.map(({ host }) => host),
    pageUser, followingServers
  }
}

const actionCreators = {
  requestFollowServer,
  requestUnfollowServer,
  userPageAction: (name) => userPage.action({name})
}

class FollowServerForm extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.follow = this.follow.bind(this)
    this.state = {
      host: ''
    }
  }

  handleChange(event) {
    this.setState({
      host: event.target.value
    })
  }

  follow() {
    this.props.follow(this.state.host)
  }

  render() {
    const { host } = this.state
    return (
      <Segment>
        <Input
          label={<Button onClick={this.follow}>Follow</Button>}
          labelPosition='right'
          value={host}
          onChange={this.handleChange}
        />
      </Segment>
    )
  }
}

class FollowingServersPage extends Component {
  constructor(props) {
    super(props)
    this.followServer = this.followServer.bind(this)
  }

  followServer(host) {
    const { hosts } = this.props
    if (host.length >= 1 && !hosts.includes(host)) {
      this.props.requestFollowServer(host)
    }
  }

  unfollowServer(id) {
    this.props.requestUnfollowServer(id)
  }

  render() {
    const { isMe, pageUser, followingServers, userPageAction } = this.props
    return (
      <div>
        <Segment vertical>
          <Header>{pageUser.display}'s Following Servers</Header>
          <Menu secondary>
            <Menu.Item href={userPage.path({name: pageUser.name})}
              onClick={(e) => { e.preventDefault(); userPageAction(pageUser.name) }}>
              {pageUser.display} <UserID user={pageUser} />
            </Menu.Item>
          </Menu>
          {isMe ? (
            <FollowServerForm follow={this.followServer} />
          ) : null}
        </Segment>
        {
          followingServers.map(({ id, host }) => (
            <Segment key={id} vertical>
              <Menu secondary>
                <Menu.Item>{host}</Menu.Item>
                {isMe ? (
                  <Menu.Item>
                    <Button icon='remove' onClick={() => this.unfollowServer(id)} />
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

export default connect(mapStateToProps, actionCreators)(FollowingServersPage)
