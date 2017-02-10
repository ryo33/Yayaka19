import React from 'react'

import { Header, Button, Segment } from 'semantic-ui-react'
import { passwordLoginURL } from '../pages.js'

export default () => (
  <Segment.Group>
    <Segment>
      <Header>Sign in or Register</Header>
      <Segment vertical>
        <Button primary size='large' href="/auth/twitter">Sign in with Twitter</Button>
      </Segment>
      <Segment vertical>
        <Button primary size='large' href="/auth/facebook">Sign in with Facebook</Button>
      </Segment>
      <Segment vertical>
        <Button primary size='large' href="/auth/github">Sign in with GitHub</Button>
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
)
