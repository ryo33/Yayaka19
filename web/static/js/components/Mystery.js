import React, { Component } from 'react'
import { connect } from 'react-redux'
import Linkify from 'react-linkify'

import { Comment, Icon, Header, Label } from 'semantic-ui-react'

import UserID from './UserID.js'
import Time from './Time.js'
import FollowButton from './FollowButton.js'
import UserButton from './UserButton.js'
import { userPage, mysteryPage } from '../pages.js'
import { createRemotePath } from '../utils.js'

const actionCreators = {
  userPageAction: name => userPage.action({name}),
  mysteryPageAction: id => mysteryPage.action({id})
}

const MysteryLink = ({ mystery, host: post_host, onClick, children }) => {
  const { id } = mystery
  const host = mystery.host || post_host
  if (host) {
    return (
      <a href={createRemotePath(host, mystery.path)}>
        {children}
      </a>
    )
  } else {
    return (
      <a href={mysteryPage.path({id})} onClick={onClick}>
        {children}
      </a>
    )
  }
}

class Mystery extends Component {
  constructor(props) {
    super(props)
    this.handleClickUser = this.handleClickUser.bind(this)
    this.handleClickTime = this.handleClickTime.bind(this)
    this.handleClickTitle = this.handleClickTitle.bind(this)
  }
  handleClickUser(e) {
    e.preventDefault()
    const { mystery, userPageAction } = this.props
    userPageAction(mystery.user.name)
  }

  handleClickTime(e) {
    e.preventDefault()
    const { mystery, mysteryPageAction } = this.props
    mysteryPageAction(mystery.id)
  }

  handleClickTitle(e) {
    e.preventDefault()
    const { mystery, mysteryPageAction } = this.props
    mysteryPageAction(mystery.id)
  }

  render() {
    const {
      host: post_host,
      mystery,
      mysteryLink = true
    } = this.props
    const { id, user, title, text, inserted_at } = mystery
    const onlyTitle = text == null || text == ''
    const host = mystery.host || post_host
    if (onlyTitle) {
      return (
        <div>
          <Header as='h2'>
            <MysteryLink host={host} mystery={mystery}
              onClick={this.handleClickTime}>
              <Icon name={host ? 'military' : 'bomb'} color='black' />
              {title}
            </MysteryLink>
          </Header>
          <UserButton Component={Label} user={user} host={host}>
            {user.display} <UserID host={host} user={user} />
          </UserButton>
          <MysteryLink host={host} mystery={mystery}
            onClick={this.handleClickTime}>
            {host ? (
              <Icon name='external' />
            ) : null}
            <Time time={inserted_at} />
          </MysteryLink>
        </div>
      )
    } else {
      return (
        <Comment.Group style={{padding: '0px', maxWidth: 'initial'}}>
          <Comment>
            <Comment.Content>
              <UserButton Component={Comment.Author} user={user} host={host}>
                {user.display}
              </UserButton>
              <Comment.Metadata>
                <UserID host={host} user={user} />
                <MysteryLink host={host} mystery={mystery}
                  onClick={this.handleClickTime}>
                  <Time time={inserted_at} />
                </MysteryLink>
                <FollowButton user={user} />
              </Comment.Metadata>
              <Comment.Text>
                <Header as='h2'>{title}</Header>
                {text ? (
                  <pre>
                    <Linkify properties={{target: '_blank'}}>
                      {text}
                    </Linkify>
                  </pre>
                ) : null}
              </Comment.Text>
            </Comment.Content>
          </Comment>
        </Comment.Group>
      )
    }
  }
}

const user = React.PropTypes.shape({
  name: React.PropTypes.string.isRequired,
  display: React.PropTypes.string.isRequired
})

Mystery.propTypes = {
  mystery: React.PropTypes.shape({
    user: user.isRequired,
    title: React.PropTypes.string.isRequired,
    text: React.PropTypes.string,
  })
}

export default connect(null, actionCreators)(Mystery)
