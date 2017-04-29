import React, { Component } from 'react'

import { Header, Button, Segment, Icon } from 'semantic-ui-react'
import { passwordLoginURL, termsURL } from '../pages.js'

class LoginPage extends Component {
  render() {
    return (
      <div>
        <Segment.Group>
          <Segment>
            <Header as='h4'>By signing in or registering, you will be deemed to have agreed to the <a
                href={termsURL} target='_blank'>terms of service</a>.
            </Header>
          </Segment>
          <Segment>
            <Header>Sign in or Register</Header>
            <Segment vertical>
              <Button color='twitter' size='large' href="/auth/twitter">
                <Icon name='twitter' />
                Sign in with Twitter
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
