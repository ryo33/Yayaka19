import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Segment, Dimmer, Loader, Message } from 'semantic-ui-react'

import { mysteryPageSelector } from '../selectors.js'
import Mystery from './Mystery.js'
import UserID from './UserID.js'

const mapStateToProps = state => {
  const mysteryPage = mysteryPageSelector(state)
  return {
    mysteryPage
  }
}

class MysteryPage extends Component {
  render() {
    const {
      mysteryPage: { mystery }
    } = this.props
    if (mystery) {
      if (mystery.text == null) {
        return (
          <Segment>
            <Message warning>
              <Message.Header>
                Content could not be loaded because your host is not trusted by <UserID user={mystery.user} />.
              </Message.Header>
            </Message>
            <Mystery mystery={mystery} />
          </Segment>
        )
      } else {
        return (
          <Segment>
            <Mystery mystery={mystery} />
          </Segment>
        )
      }
    } else {
      return (
        <Segment>
          <Loader active inline='centered'/>
        </Segment>
      )
    }
  }
}

export default connect(mapStateToProps)(MysteryPage)
