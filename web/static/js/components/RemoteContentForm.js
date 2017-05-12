import React, { Component } from 'react'

import { Segment, Button, Form } from 'semantic-ui-react'

class RemoteContentForm extends Component {
  constructor(props) {
    super(props)
    this.open = this.open.bind(this)
    this.changeHost = this.changeHost.bind(this)
    this.changeID = this.changeID.bind(this)
    this.state = {
      host: props.host || '',
      id: props.id || '',
      opened: false
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      host: newProps.host || '',
      id: newProps.id || ''
    })
  }

  open(event) {
    event.preventDefault()
    const { host, id } = this.state
    if (host.length > 0 && id.length > 0) {
      this.props.onRequest(host, id)
      this.setState({
        opened: true
      })
    }
  }

  changeHost(event) {
    this.setState({
      opened: false,
      host: event.target.value
    })
  }

  changeID(event) {
    this.setState({
      opened: false,
      id: event.target.value
    })
  }

  render() {
    const { placeholder, children } = this.props
    const { host, id, opened } = this.state
    return (
      <Segment>
        <Segment vertical>
          <Form onSubmit={this.open}>
            <Form.Group>
              <Form.Input placeholder='Host' name='host'
                value={host} onChange={this.changeHost} />
              <Form.Input placeholder={placeholder} name='id'
                value={id} onChange={this.changeID} />
              <Form.Button content='Request' />
            </Form.Group>
          </Form>
        </Segment>
        {opened ? children : null}
      </Segment>
    )
  }
}

export default RemoteContentForm
