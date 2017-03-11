import React, { Component } from 'react'

import { Header, Button, Segment, Dimmer, Checkbox, Icon } from 'semantic-ui-react'
import { passwordLoginURL, termsURL } from '../pages.js'

class LoginPage extends Component {
  constructor(props) {
    super(props)
    this.handleToggle = this.handleToggle.bind(this)
    this.state = {
      agreed: false
    }
  }

  handleToggle() {
    this.setState({
      agreed: !this.state.agreed
    })
  }

  render() {
    const { agreed } = this.state
    return (
      <div>
        <Checkbox onChange={this.handleToggle} checked={agreed} label={(
          <label>I agree to the <a href={termsURL} target='_blank'>terms of service</a></label>
        )} />
        <Segment.Group>
          <Dimmer inverted active={!agreed} />
          <Segment>
            <Header>Sign in or Register</Header>
            <Segment vertical>
              <Button color='twitter' size='large' href="/auth/twitter">
                <Icon name='twitter' />
                Sign in with Twitter
              </Button>
            </Segment>
            <Segment vertical>
              <Button color='facebook' size='large' href="/auth/facebook">
                <Icon name='facebook' />
                Sign in with Facebook
              </Button>
            </Segment>
            <Segment vertical>
              <Button color='black' size='large' href="/auth/github">
                <Icon name='github' />
                Sign in with GitHub
              </Button>
            </Segment>
            <Segment vertical>
              <a href="/auth/google" id="sign-in-with-google"></a>
            </Segment>
          </Segment>
          <Segment>
            <Header>Sign in with password</Header>
            <Segment vertical>
              <Button primary size='large' href={passwordLoginURL}>ID and password</Button>
            </Segment>
          </Segment>
        </Segment.Group>
    </div>
    )
  }
}

export default LoginPage
