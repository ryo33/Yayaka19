import React, { Component } from 'react'
import { connect } from 'react-redux'
import Linkify from 'react-linkify'
import queryString from 'query-string'

import { Comment, Icon, Header, Label } from 'semantic-ui-react'

import UserID from './UserID.js'
import Time from './Time.js'
import FollowButton from './FollowButton.js'
import UserButton from './UserButton.js'
import { userPage, mysteryPage, remoteMysteryPage } from '../pages.js'
import { createRemoteMysteryPath, isRemoteHost, getLocalID } from '../utils.js'

const actionCreators = {
  userPageAction: name => userPage.action({name}),
  mysteryPageAction: id => mysteryPage.action({id})
}

const MysteryLink = ({ mystery, onClick, children }) => {
  const id = getLocalID(mystery)
  const host = mystery.host
  if (isRemoteHost(host)) {
    const path = remoteMysteryPage.path()
    const query = queryString.stringify({host: host, id})
    const url = `${path}?${query}`
    return (
      <a href={url}>
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
    mysteryPageAction(getLocalID(mystery))
  }

  handleClickTitle(e) {
    e.preventDefault()
    const { mystery, mysteryPageAction } = this.props
    mysteryPageAction(getLocalID(mystery))
  }

  images (text) {
    var html = '';
    var rows = text.split ("\n");
    for (var i = 0; i < rows.length; i++) {
      var row = rows [i];
      if (/^http:\/\/mdii\.tk\/\w+\.(svg|png|jpeg)$/.test (row))
      {
        html +=
          '<a href="' + row + '" target="_blank">' +
          '<img ' +
          'src="' + row + '" ' +
          'class="mystery" />' +
          '</a> ';
      }
    }
    return {__html: html};
  }

  render() {
    const {
      host: post_host,
      mystery,
      mysteryLink = true
    } = this.props
    const { user, title, text, inserted_at } = mystery
    const onlyTitle = text == null || text == ''
    const host = mystery.host || post_host
    if (onlyTitle) {
      return (
        <div>
          <Header as='h2'>
            <MysteryLink host={host} mystery={mystery}
              onClick={this.handleClickTime}>
              <Icon name={isRemoteHost(host) ? 'military' : 'bomb'} color='black' />
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
                <div dangerouslySetInnerHTML={this.images(text)} />
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
