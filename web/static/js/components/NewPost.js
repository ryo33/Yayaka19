import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Header, Segment, Button, Form, Label, Icon } from 'semantic-ui-react'

import { submitPost, updatePostAddress } from '../actions/index.js'
import {
  newPostPageSelector, userSelector, editorPluginsSelector
} from '../selectors.js'
import { handlers } from '../editorPlugins.js'


import Post from './Post.js'
import EditorPluginsSelector from './EditorPluginsSelector.js'

const mapStateToProps = state => {
  const user = userSelector(state)
  const { plugins } = editorPluginsSelector(state)
  return {
    user, plugins,
    ...newPostPageSelector(state)
  }
}

const actionCreators = {
  submitPost,
  updatePostAddress
}

class NewPost extends Component {
  constructor(props) {
    super(props)
    this.handleChangeText = this.handleChangeText.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.submit = this.submit.bind(this)
    this.handleRemoveAddress = this.handleRemoveAddress.bind(this)
    this.handleClickPlugins = this.handleClickPlugins.bind(this)
    this.state = {
      text: '',
      options: [],
      showPlugins: false
    }
  }

  componentWillMount() {
    const { top, text } = this.props
    if (top) {
      this.setState({text, options: []})
    }
  }

  componentWillReceiveProps(nextProps) {
    const { top, text } = this.props
    if (top && text !== nextProps.text) {
      this.setState({text: nextProps.text, options: []})
    }
  }

  handleRemoveAddress() {
    const { updatePostAddress } = this.props
    updatePostAddress('')
  }

  reset() {
    this.setState({text: '', options: []})
    updatePostAddress('')
  }

  submit(e) {
    e.preventDefault()
    const { top, post, address, reply, plugins, allowEmpty = false, submitPost, onSubmitHandler } = this.props
    const { text } = this.state
    if (allowEmpty || text.length >= 1) {
      const replyAddress = reply ? reply.user.name : ''
      const finalAddress = top ? address : replyAddress
      const postID = post ? post.id : null
      const transformedText = handlers.transform(plugins, text)
      submitPost(transformedText, finalAddress, postID)
      this.reset()
      if (onSubmitHandler) {
        onSubmitHandler()
      }
    }
  }

  changeText(nextText) {
    const { plugins } = this.props
    const { text } = this.state
    const options = handlers.handleChange(plugins, text, nextText)
    this.setState({text: nextText, options})
  }

  handleChangeText(event) {
    this.changeText(event.target.value)
  }

  handleClickOption(option) {
    const { plugins } = this.props
    const { text } = this.state
    const nextText = handlers.handleSelect(plugins, text, option)
    this.changeText(nextText)
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
      post, user, address, postAddresses, plugins,
      allowEmpty = false, rows = 6
    } = this.props
    const { text, options, showPlugins } = this.state
    const transformedText = handlers.transform(plugins, text)
    const preview = text !== transformedText
    return (
      <Segment.Group>
        <Segment>
          <Header>New Post</Header>
          <Form onSubmit={this.submit}>
            {address.length != 0 ? (
              <Label>
                <Icon name='send' /> {address} <Icon name='delete' onClick={this.handleRemoveAddress} />
              </Label>
            ) : null}
            {
              options.map(option => (
                <Label basic as='a' key={option.id} content={option.text}
                  onClick={() => this.handleClickOption(option)} />
              ))
            }
            <Form.TextArea name='text' value={text} rows={rows} placeholder={'What\'s in your head?'}
              onChange={this.handleChangeText} onKeyDown={this.handleKeyDown} autoFocus />
            <Form.Group inline style={{marginBottom: "0px"}}>
              <Form.Button disabled={!allowEmpty && text.length == 0} primary>Submit</Form.Button>
              <Label size='large'>{user.display} @{user.name}</Label>
              <Label basic as='a' icon='puzzle' content={plugins.length} size='large'
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

const component = connect(mapStateToProps, actionCreators)(NewPost)

component.PropTypes = {
  onSubmitHandler: React.PropTypes.func,
  post: React.PropTypes.object,
  reply: React.PropTypes.object,
  allowEmpty: React.PropTypes.bool,
  top: React.PropTypes.bool,
  rows: React.PropTypes.integer
}

export default component
