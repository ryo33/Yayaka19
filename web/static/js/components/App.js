import React, { Component } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import {
  Icon, Menu, Label, Sidebar, Segment, Container,
  Confirm, Button, Header, Message
} from 'semantic-ui-react'

import { title, signedIn, source, admin } from '../global.js'
import {
  home, publicTimeline, timeline, onlinePosts,
  userPage, userFormPage,
  postPage, loginPage, noticesPage,
  apiURL, logoutURL, newAccountURL, getSwitchUserURL,
  passwordUpdateURL
} from '../pages.js'
import {
  pageSelector, userSelector, usersSelector,
  timelineSelector, onlinePostsCountSelector,
  noticesCountSelctor, newPostPageSelector,
  errorSelector
} from '../selectors.js'
import {
  openNewPostDialog, closeNewPostDialog,
  hideError, doPing
} from '../actions/index.js'
import Router from './Router.js'
import NewPost from './NewPost.js'

const mapStateToProps = state => {
  const { newPosts } = timelineSelector(state)
  return {
    newPost: newPostPageSelector(state).open,
    newPostsCount: newPosts.length,
    onlinePostsCount: onlinePostsCountSelector(state),
    page: pageSelector(state),
    user: userSelector(state),
    users: usersSelector(state),
    noticesCount: noticesCountSelctor(state),
    error: errorSelector(state)
  }
}

const actionCreators = {
  homeAction: () => home.action(),
  publicTimelineAction: () => publicTimeline.action(),
  timelineAction: () => timeline.action(),
  onlinePostsAction: () => onlinePosts.action(),
  userPageAction: name => userPage.action({name}),
  userFormPageAction: name => userFormPage.action({name}),
  loginPageAction: () => loginPage.action(),
  noticesPageAction: () => noticesPage.action(),
  openNewPostDialog, closeNewPostDialog,
  hideError, doPing
}

const menuStyle = {
  marginBottom: '8px'
}

const iconItemStyle = {
  padding: '0.9em'
}

const iconStyle = {
  margin: '0px'
}

const labelStyle = {
  marginLeft: '0.4em'
}

class App extends Component {
  constructor(props) {
    super(props)
    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.closeSidebar = this.closeSidebar.bind(this)
    this.openLogoutDialog = this.openLogoutDialog.bind(this)
    this.closeLogoutDialog = this.closeLogoutDialog.bind(this)
    this.openNewPost = this.openNewPost.bind(this)
    this.closeNewPost = this.closeNewPost.bind(this)
    this.hideError = this.hideError.bind(this)
    this.doPing = this.doPing.bind(this)
    this.state = {
      sidebar: false,
      logout: false,
    }
  }

  toggleSidebar() {
    this.setState({sidebar: !this.state.sidebar})
  }

  closeSidebar() {
    this.setState({sidebar: false})
  }

  openLogoutDialog() {
    this.setState({logout: true})
  }

  closeLogoutDialog() {
    this.setState({logout: false})
  }

  openNewPost() {
    const { openNewPostDialog } = this.props
    openNewPostDialog()
  }

  closeNewPost() {
    const { closeNewPostDialog } = this.props
    closeNewPostDialog()
  }

  handleLogout() {
    window.location.href = logoutURL
  }

  hideError() {
    const { hideError } = this.props
    hideError()
  }

  handleSwitchUser(name) {
    window.location.href = getSwitchUserURL(name)
  }

  reload() {
    window.location.reload(true)
  }

  doPing() {
    const { doPing } = this.props
    doPing()
  }

  render() {
    const {
      page: { name, params }, error, user, users,
      userPageAction,
      userFormPageAction,
      homeAction,
      publicTimelineAction,
      timelineAction,
      onlinePostsAction,
      newPostAction,
      loginPageAction,
      noticesPageAction,
      newPostsCount,
      onlinePostsCount,
      noticesCount,
      newPost
    } = this.props
    const { sidebar, logout } = this.state
    const titleNotices = error
      ? -1
      : newPostsCount + onlinePostsCount + noticesCount
    return (
      <div>
        <Helmet title={
          titleNotices === 0 ? title : `(${titleNotices}) ${title}`
        } />
        <Menu style={menuStyle}>
          <Container>
            <Menu.Item style={iconItemStyle} active={name == publicTimeline.name} onClick={publicTimelineAction}>
              <Icon style={iconStyle} size='large' name='world' />
            </Menu.Item>
            {signedIn ? (
              <Menu.Item style={iconItemStyle} active={name == timeline.name} onClick={timelineAction}>
                <Icon style={iconStyle} size='large' name='home' />
                { newPostsCount >= 1 ? (
                  <Label size='tiny' circular style={labelStyle} color='blue'>
                    {newPostsCount}
                  </Label>
                ) : null }
              </Menu.Item>
            ) : null}
            {signedIn ? (
              <Menu.Item style={iconItemStyle} active={name == onlinePosts.name} onClick={onlinePostsAction}>
                <Icon style={iconStyle} size='large' name='bar' />
                { onlinePostsCount >= 1 ? (
                  <Label size='tiny' circular style={labelStyle} color='yellow'>
                    {onlinePostsCount}
                  </Label>
                ) : null }
              </Menu.Item>
            ) : null }
            {signedIn ? (
              <Menu.Item style={iconItemStyle} active={name == noticesPage.name} onClick={noticesPageAction}>
                <Icon style={iconStyle} size='large' color='red' name='alarm outline' />
                { noticesCount >= 1 ? (
                  <Label size='tiny' circular style={labelStyle} color='red'>
                    {noticesCount}
                  </Label>
                ) : null }
              </Menu.Item>
            ) : null }
            {signedIn ? (
              <Menu.Item style={iconItemStyle} active={newPost} onClick={newPost ? this.closeNewPost : this.openNewPost}>
                <Icon style={iconStyle} size='large' color='blue' name='write' />
              </Menu.Item>
            ) : null}
            <Menu.Menu position='right'>
              { !signedIn ? (
                <Menu.Item style={iconItemStyle}>
                  <Button primary onClick={loginPageAction}>Sign in</Button>
                </Menu.Item>
              ) : null }
              <Menu.Item style={iconItemStyle} onClick={this.toggleSidebar}>
                <Icon style={iconStyle} size='large' name='caret down' />
              </Menu.Item>
            </Menu.Menu>
          </Container>
        </Menu>
        <Sidebar.Pushable as={React.div}>
          <Sidebar onClick={this.toggleSidebar}
            as={Menu} animation='overlay' direction='top' visible={sidebar} vertical>
            {signedIn ? (
              <Menu.Item>
                <Menu.Header>{user.display} @{user.name}</Menu.Header>
                <Menu.Menu>
                  <Menu.Item onClick={() => userPageAction(user.name)}>
                    View my profile
                  </Menu.Item>
                  <Menu.Item onClick={() => userFormPageAction(user.name)}>
                    Edit my profile
                  </Menu.Item>
                  <Menu.Item link href={passwordUpdateURL}>
                    Update my password
                  </Menu.Item>
                </Menu.Menu>
              </Menu.Item>
            ) : null}
            {signedIn ? (
            <Menu.Item>
              <Menu.Header>Accounts</Menu.Header>
              <Menu.Menu>
                {users.map(user => (
                  <Menu.Item key={user.id} onClick={() => this.handleSwitchUser(user.name)}>
                    {user.display} @{user.name}
                  </Menu.Item>
                ))}
                <Menu.Item link href={newAccountURL}>
                  Create a new account
                </Menu.Item>
              </Menu.Menu>
            </Menu.Item>
            ) : null}
            <Menu.Item>
              <Menu.Header>API</Menu.Header>
              <Menu.Menu>
                <Menu.Item link href={api.url} target='_blank'>
                  API Documentation
                </Menu.Item>
                {user.name ? (
                  <Menu.Item link href={apiURL} target='_blank'>
                    View my SECRET
                  </Menu.Item>
                ) : null}
              </Menu.Menu>
            </Menu.Item>
            <Menu.Item link href={admin.url} target='_blank'>
              <Menu.Header>Contact admin ({admin.name})</Menu.Header>
              <p>Any bug reports, questions, and suggestions are welcome. Thanks!</p>
            </Menu.Item>
            <Menu.Item link href={source.url} target='_blank'>
              Source code
            </Menu.Item>
            {signedIn ? (
              <Menu.Item onClick={this.openLogoutDialog}>
                Sign out
              </Menu.Item>
            ) : null}
          </Sidebar>
          <Sidebar.Pusher dimmed={sidebar} onClick={this.closeSidebar}>
            <Container>
              {error ? (
                <Message
                  negative
                  onDismiss={this.hideError}
                >
                  <Message.Header>{error}</Message.Header>
                  <Button onClick={this.doPing}>Ping</Button>
                  <Button onClick={this.reload}>Reload</Button>
                </Message>
              ) : null}
              {newPost ? <NewPost top /> : null}
              <Router name={name} params={params} />
            </Container>
            <div style={{height: "600px"}}></div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        <Confirm
          open={logout}
          content='Are you sure you want to sign out?'
          onCancel={this.closeLogoutDialog}
          onConfirm={this.handleLogout}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(App)
