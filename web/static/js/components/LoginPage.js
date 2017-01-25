import React from 'react'

import { Button, Segment } from 'semantic-ui-react'

export default () => (
  <Segment.Group>
    <Segment>
      <a href="/auth/google" id="sign-in-with-google"></a>
    </Segment>
    <Segment>
      <Button primary size='massive' href="/auth/github">Sign in with GitHub</Button>
    </Segment>
    <Segment>
      <Button primary size='massive' href="/auth/facebook">Sign in with Facebook</Button>
    </Segment>
  </Segment.Group>
)
