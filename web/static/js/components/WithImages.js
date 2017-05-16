import React, { Component, Children } from 'react'
import Linkify from 'react-linkify'
import linkifyIt from 'linkify-it'
import tlds from 'tlds'

import { Image, Button } from 'semantic-ui-react'

const linkify = linkifyIt()
linkify.tlds(tlds)

import { trustedHosts } from '../global.js'

const imageRegExp = new RegExp('.+\.(svg|png|jpeg)$')

class WithImages extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      show: false
    }
  }

  handleClick() {
    this.setState({
      show: true
    })
  }

  render() {
    const { text } = this.props
    if (text == null) return null
    const images = (linkify.match(text) || []).map(({ url }, idx) => {
      const urlObj = new URL(url)
      if (imageRegExp.test(urlObj.pathname)
        && trustedHosts.includes(urlObj.host)
      ) {
        return (
          <Image
            key={`${url}@@${idx}`}
            src={url}
            as='a' size='medium'
            href={url}
            target='_blank'
          />
        )
      } else {
        return null
      }
    }).filter(child => child != null)
    if (images.length >= 1 && !this.state.show) {
      return (
        <div>
          <Linkify properties={{target: '_blank'}}>
            {text}
          </Linkify>
          <div>
            <Button onClick={this.handleClick}>
              Show {images.length} image{images.length == 1 ? '' : 's'}
            </Button>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <Linkify properties={{target: '_blank'}}>
            {text}
          </Linkify>
          <div>
            {images}
          </div>
        </div>
      )
    }
  }
}

export default WithImages
