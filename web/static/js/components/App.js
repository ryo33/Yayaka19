import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  Icon, Menu, Label, Sidebar, Segment, Container, Confirm, Button
} from 'semantic-ui-react'

import { signedIn, source } from '../global.js'
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
  pageSelector, userSelector, noticesCountSelctor
} from '../selectors.js'

const mapStateToProps = state => {
  return {
    page: pageSelector(state),
    user: userSelector(state),
    noticesCount: noticesCountSelctor(state)
  }
}

const actionCreators = {
  homeAction: home.action,
  publicTimelineAction: publicTimeline.action,
  timelineAction: timeline.action,
  loginPageAction: loginPage.action,
  noticesPageAction: noticesPage.action
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
      newPost: false,
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
    this.setState({newPost: true})
  }

  closeNewPost() {
    this.setState({newPost: false})
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
      homeAction,
      publicTimelineAction,
      timelineAction,
      newPostAction,
      loginPageAction,
      noticesPageAction,
      noticesCount
    } = this.props
    const { newPost, sidebar, logout } = this.state
    return (
      <div>
        <Menu>
          <Container>
            <Menu.Item active={name == publicTimeline.name} onClick={publicTimelineAction}>
              <Icon name='world' size='large' />
            </Menu.Item>
            {signedIn ? (
              <Menu.Item active={name == timeline.name} onClick={timelineAction}>
                <Icon name='home' size='large' />
              </Menu.Item>
            ) : null}
            {signedIn ? (
              <Menu.Item active={name == noticesPage.name} onClick={noticesPageAction}>
                <Icon name='alarm' size='large' />
                { noticesCount >= 1 ? <Label color='red'>{noticesCount}</Label> : null }
              </Menu.Item>
            ) : null }
            {signedIn ? (
              <Menu.Item active={newPost} onClick={newPost ? this.closeNewPost : this.openNewPost}>
                <Icon color='blue' name='write' size='large' />
              </Menu.Item>
            ) : null}
            <Menu.Menu position='right'>
              { !signedIn ? (
                <Menu.Item>
                  <Button primary onClick={loginPageAction}>Sign in</Button>
                </Menu.Item>
              ) : null }
              <Menu.Item onClick={this.toggleSidebar}>
                <Icon name='caret down' size='large' />
              </Menu.Item>
            </Menu.Menu>
          </Container>
        </Menu>
          <Sidebar.Pushable as={React.div}>
            <Sidebar onClick={this.toggleSidebar}
              as={Menu} animation='overlay' width='thin' direction='top' visible={sidebar} vertical>
              <Menu.Item link href={source.url} target="_blank">
                Source Code
              </Menu.Item>
              {
                signedIn
                  ? <Menu.Item name='Sign out' onClick={this.openLogoutDialog}>
                    Sign out
                  </Menu.Item>
                  : null
              }
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
