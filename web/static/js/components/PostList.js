import React from 'react'
import { connect } from 'react-redux'

import { Segment } from 'semantic-ui-react'

import { userSelector } from '../selectors.js'
import { getPostKey } from '../utils.js'
import Post from './Post.js'

const PostList = ({ followButton = true, posts, footers = {}, children }) => (
  <div>
    {
      posts.map(post => {
        const key = getPostKey(post)
        const element = (
          <Segment key={key} vertical>
            <Post
              list
              followButton={followButton}
              post={post}
            />
          </Segment>
        )
        const footer = footers[key]
        if (footer != null) {
          return [
            element,
            <Segment key={key + '-footer'} vertical>
              {footer}
            </Segment>
          ]
        } else {
          return element
        }
      })
    }
    {children}
  </div>
)

PostList.propTypes = {
  followButton: React.PropTypes.bool,
  posts: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.number.isRequired,
    user: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      display: React.PropTypes.string.isRequired
    }),
    text: React.PropTypes.string
  })).isRequired,
  children: React.PropTypes.node
}

export default PostList
