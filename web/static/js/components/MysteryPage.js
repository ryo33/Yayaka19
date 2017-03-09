import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Segment, Dimmer, Loader } from 'semantic-ui-react'

import { mysteryPageSelector } from '../selectors.js'
import Mystery from './Mystery.js'

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
      return (
        <Segment>
          <Mystery mystery={mystery} />
        </Segment>
      )
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
