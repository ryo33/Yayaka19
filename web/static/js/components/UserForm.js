import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Segment, Header, Form } from 'semantic-ui-react'

import { userPage } from '../pages.js'
import { editUser } from '../actions.js'
import { userSelector } from '../selectors.js'

const mapStateToProps = state => {
  const user = userSelector(state)
  return {
    user
  }
}

const actionCreators = {
  editUser,
  userPageAction: name => userPage.action({name})
}

class UserForm extends Component {
  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
    this.handleChangeDisplay = this.handleChangeDisplay.bind(this)
    this.handleChangeBio = this.handleChangeBio.bind(this)
    this.state = {
      display: '',
      bio: ''
    }
  }

  handleChangeDisplay(e) {
    const display = e.target.value
    this.setState({display})
  }

  handleChangeBio(e) {
    const bio = e.target.value
    this.setState({bio})
  }

  componentWillMount() {
    const { user, params, userPageAction } = this.props
    if (user.name !== params.name) {
      userPageAction(params.name)
    } else {
      this.setState({
        display: user.display,
        bio: user.bio || ''
      })
    }
  }

  submit(e) {
    e.preventDefault()
    const { editUser } = this.props
    const { display, bio } = this.state
    editUser({display, bio})
  }

  render() {
    const { display, bio } = this.state
    const valid = display.length >= 1
    return (
      <Segment>
        <Header>Edit Your Profile</Header>
        <Form onSubmit={this.submit}>
          <Form.Input label='Name' name='display' value={display}
            placeholder={'Name'} onChange={this.handleChangeDisplay} autoFocus />
          <Form.TextArea label='Bio' name='bio' value={bio} rows='6'
            placeholder={'Bio'} onChange={this.handleChangeBio} />
          <Form.Button disabled={!valid} primary>Submit</Form.Button>
        </Form>
      </Segment>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(UserForm)
