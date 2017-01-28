import React, { Component } from 'react'
import { connect } from 'react-redux'
import Helmet from "react-helmet"

import {
  Icon, Menu, Label, Sidebar, Segment, Container,
  Confirm, Button, Header
} from 'semantic-ui-react'

import { signedIn, source, admin } from '../global.js'
import {
  home, publicTimeline, timeline, userPage, loginPage, noticesPage
} from '../pages.js'
import PublicTimeline from './PublicTimeline.js'
import Timeline from './Timeline.js'
import NewPost from './NewPost.js'
import UserPage from './UserPage.js'
import LoginPage from './LoginPage.js'
import ErrorPage from './ErrorPage.js'
import NoticesPage from './NoticesPage.js'
import {
  timelineSelector, pageSelector, userSelector,
  noticesCountSelctor, newPostPageSelector
} from '../selectors.js'
import {
  openNewPostDialog, closeNewPostDialog
} from '../actions.js'

const mapStateToProps = state => {
  const { newPosts } = timelineSelector(state)
  return {
    newPost: newPostPageSelector(state).open,
    newPostsCount: newPosts.length,
    page: pageSelector(state),
    user: userSelector(state),
    noticesCount: noticesCountSelctor(state)
  }
}

const actionCreators = {
  userPageAction: name => userPage.action({name}),
  homeAction: () => home.action(),
  publicTimelineAction: () => publicTimeline.action(),
  timelineAction: () => timeline.action(),
  loginPageAction: () => loginPage.action(),
  noticesPageAction: () => noticesPage.action(),
  openNewPostDialog,
  closeNewPostDialog
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
    this.openLogoutDialog = this.openLogoutDialog.bind(this)
    this.closeLogoutDialog = this.closeLogoutDialog.bind(this)
    this.openNewPost = this.openNewPost.bind(this)
    this.closeNewPost = this.closeNewPost.bind(this)
    this.state = {
      sidebar: false,
      logout: false,
    }
  }

  toggleSidebar() {
    this.setState({sidebar: !this.state.sidebar})
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
    window.location.href = '/logout'
  }

  renderPage() {
    const { page } = this.props
    switch (page.name) {
      case publicTimeline.name:
        return <PublicTimeline />
      case timeline.name:
        return <Timeline />
      case userPage.name:
        return <UserPage params={page.params} />
      case noticesPage.name:
        return <NoticesPage />
      case loginPage.name:
        return <LoginPage />
      default:
        return <ErrorPage />
    }
  }

  render() {
    const {
      page: { name },
      user,
      userPageAction,
      homeAction,
      publicTimelineAction,
      timelineAction,
      newPostAction,
      loginPageAction,
      noticesPageAction,
      newPostsCount,
      noticesCount,
      newPost
    } = this.props
    const { sidebar, logout } = this.state
    return (
      <div>
        <Helmet title={
          noticesCount == 0 ? 'Share' : `(${noticesCount}) Share`
        } />
        <Menu>
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
              <Menu.Item style={iconItemStyle} active={name == noticesPage.name} onClick={noticesPageAction}>
                <Icon style={iconStyle} size='large' name='alarm' />
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
              as={Menu} animation='overlay' width='thin' direction='top' visible={sidebar} vertical>
              {user ? (
                <Menu.Item>
                  <Menu.Header>{user.display} @{user.name}</Menu.Header>
                  <Menu.Menu>
                    <Menu.Item onClick={() => userPageAction(user.name)}>
                      View my profile
                    </Menu.Item>
                    <Menu.Item link href='/profile'>
                      Edit my profile
                    </Menu.Item>
                  </Menu.Menu>
                </Menu.Item>
              ) : null}
              <Menu.Item link href={admin.url} target="_blank">
                <Menu.Header>Contact admin ({admin.name})</Menu.Header>
                <p>Any bug reports, questions, and suggestions are welcome. Thanks!</p>
              </Menu.Item>
              <Menu.Item link href={source.url} target="_blank">
                Source code
              </Menu.Item>
              {signedIn ? (
                <Menu.Item onClick={this.openLogoutDialog}>
                  Sign out
                </Menu.Item>
              ) : null}
              <Confirm
                open={logout}
                content='Are you sure you want to sign out?'
                onCancel={this.closeLogoutDialog}
                onConfirm={this.handleLogout}
              />
            </Sidebar>
            <Sidebar.Pusher>
              <Container>
                {newPost ? <NewPost /> : null}
                {this.renderPage()}
              </Container>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(App)
