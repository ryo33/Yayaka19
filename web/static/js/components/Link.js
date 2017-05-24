import React, { Component } from 'react'
import { connect } from 'react-redux'

import { push } from '../actions/index.js'

const actionCreators = {
  push
}

class Link extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event) {
    event.preventDefault()
    const { push, href } = this.props
    push(href)
  }

  render() {
    const { href, as = 'a', children, push, ...props } = this.props
    const Element = as
    return (
      <Element href={href} onClick={this.handleClick} {...props}>
        {children}
      </Element>
    )
  }
}

export default connect(null, actionCreators)(Link)
