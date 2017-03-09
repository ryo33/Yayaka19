import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Header, Segment, Button, Form, Label, Icon } from 'semantic-ui-react'

import { submitMystery } from '../actions/index.js'
import {
  userSelector, editorPluginsSelector
} from '../selectors.js'
import { handlers } from '../editorPlugins.js'
import Mystery from './Mystery.js'
import EditorPluginsOptions from './EditorPluginsOptions.js'
import EditorPluginsButton from './EditorPluginsButton.js'
import EditorPluginsSelector from './EditorPluginsSelector.js'

const mapStateToProps = state => {
  const user = userSelector(state)
  const { plugins } = editorPluginsSelector(state)
  return {
    user, plugins
  }
}

const actionCreators = {
  submitMystery
}

const TITLE_MIN_LENGTH = 1
const TITLE_MAX_LENGTH = 128
const TEXT_MIN_LENGTH = 1
const TEXT_MAX_LENGTH = 4096

class NewMystery extends Component {
  constructor(props) {
    super(props)
    this.changeText = this.changeText.bind(this)
    this.handleChangeText = this.handleChangeText.bind(this)
    this.handleChangeTitle = this.handleChangeTitle.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.submit = this.submit.bind(this)
    this.handleClickPlugins = this.handleClickPlugins.bind(this)
    this.state = {
      title: '',
      text: '',
      previousText: '',
      showPlugins: false
    }
  }

  reset() {
    this.setState({title: '', text: '', previousText: ''})
  }

  submit(e) {
    e.preventDefault()
    const { plugins, submitMystery, onSubmitHandler } = this.props
    const { title, text } = this.state
    if (this.validateLength(title, text)) {
      const transformedText = handlers.transform(plugins, text)
      submitMystery({title, text: transformedText})
      this.reset()
      if (onSubmitHandler) {
        onSubmitHandler()
      }
    }
  }

  validateLength(title, text) {
    return TITLE_MIN_LENGTH <= title.length
      && TITLE_MAX_LENGTH >= title.length
      && TEXT_MIN_LENGTH <= text.length
      && TEXT_MAX_LENGTH >= text.length
  }

  changeText(nextText) {
    const { text } = this.state
    this.setState({previousText: text, text: nextText})
  }

  handleChangeText(event) {
    this.changeText(event.target.value)
  }

  handleChangeTitle(event) {
    this.setState({title: event.target.value})
  }

  handleKeyDown(event) {
    if (event.keyCode === 13 && (event.ctrlKey || event.metaKey) && !(event.ctrlKey && event.metaKey)) {
      this.submit(event)
    }
  }

  handleClickPlugins() {
    this.setState({showPlugins: !this.state.showPlugins})
  }

  render() {
    const {
      user, plugins, rows = 6
    } = this.props
    const { title, text, previousText, showPlugins } = this.state
    const transformedText = handlers.transform(plugins, text)
    const preview = text !== transformedText
    const valid = this.validateLength(title, text)
    return (
      <Segment.Group>
        <Segment>
          <Header>New Mystery</Header>
          <Form onSubmit={this.submit}>
            <Form.Input name='title' value={title} placeholder={'Title'}
              onChange={this.handleChangeTitle} autoFocus />
            <EditorPluginsOptions text={text} previousText={previousText}
              plugins={plugins} onChange={this.changeText} />
            <Form.TextArea name='text' value={text} rows={rows} placeholder={'What\'s in your head?'}
              onChange={this.handleChangeText} onKeyDown={this.handleKeyDown} />
            <Form.Group inline style={{marginBottom: "0px"}}>
              <Form.Button disabled={!valid} primary>Submit</Form.Button>
              <Label size='large'>{user.display} @{user.name}</Label>
              <EditorPluginsButton plugins={plugins}
                onClick={this.handleClickPlugins} />
            </Form.Group>
          </Form>
        </Segment>
        {showPlugins ? (
          <Segment>
            <EditorPluginsSelector />
          </Segment>
        ) : null}
        {preview ? (
          <Segment>
            <Header>Preview</Header>
            <pre>
              {transformedText}
            </pre>
          </Segment>
        ) : null}
      </Segment.Group>
    )
  }
}

const component = connect(mapStateToProps, actionCreators)(NewMystery)

component.PropTypes = {
  onSubmitHandler: React.PropTypes.func,
  rows: React.PropTypes.integer
}

export default component
