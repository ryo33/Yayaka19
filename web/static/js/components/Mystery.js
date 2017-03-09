import React, { Component } from 'react'
import { connect } from 'react-redux'
import Linkify from 'react-linkify'

import { Comment, Icon, Header, Label } from 'semantic-ui-react'

import Time from './Time.js'
import FollowButton from './FollowButton.js'
import UserButton from './UserButton.js'
import { userPage, mysteryPage } from '../pages.js'

const actionCreators = {
  userPageAction: name => userPage.action({name}),
  mysteryPageAction: id => mysteryPage.action({id})
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
      mystery: { id, user, title, text, inserted_at },
      mysteryLink = true
    } = this.props
    const onlyTitle = text == null || text == ''
    if (onlyTitle) {
      return (
        <div>
          <Header as='h2'>
            <a href={mysteryPage.path({id})} onClick={this.handleClickTitle}>
              <Icon name='bomb' color='black' />
              {title}
            </a>
          </Header>
          <Label href={userPage.path({name: user.name})} onClick={this.handleClickUser}>
            {user.display} @{user.name}
          </Label>
          <a href={mysteryPage.path({id})} onClick={this.handleClickTime}>
            <Time time={inserted_at} />
          </a>
        </div>
      )
    } else {
      return (
        <Comment.Group style={{padding: '0px', maxWidth: 'initial'}}>
          <Comment>
            <Comment.Content>
              <Comment.Author as={React.a} href={userPage.path({name: user.name})} onClick={this.handleClickUser}>
                {user.display}
              </Comment.Author>
              <Comment.Metadata>
                <span>@{user.name}</span>
                <a href={mysteryPage.path({id})} onClick={this.handleClickTime}>
                  <Time time={inserted_at} />
                </a>
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
