import React, { Component } from 'react'
import { connect } from 'react-redux'
import Linkify from 'react-linkify'

import { Comment, Icon, Segment } from 'semantic-ui-react'

import FollowButton from './FollowButton.js'
import UserButton from './UserButton.js'
import { requestFav, requestUnfav } from '../actions.js'
import { userSelector, favsSelector } from '../selectors.js'

const mapStateToProps = (state) => {
  const favs = favsSelector(state)
  return {
    favs
  }
}

const actionCreators = {
  requestFav, requestUnfav
}

const PostAddresses = ({ addresses = [] }) => (
  <div>
    {
      addresses.map(({ user }) => (
        <span key={user.name}>
          <UserButton user={user} className="link">
            <Icon name='send' />
            {user.display} (@{user.name})
          </UserButton>
        </span>
      ))
    }
  </div>
)

class Post extends Component {
  constructor(props) {
    super(props)
    this.fav = this.fav.bind(this)
    this.unfav = this.unfav.bind(this)
  }

  fav() {
    const { requestFav, post } = this.props
    requestFav(post.id)
  }

  unfav() {
    const { requestUnfav, post } = this.props
    requestUnfav(post.id)
  }

  renderFavButton() {
    const { favs, post } = this.props
    if (favs.includes(post.id)) {
      return (
        <Comment.Action onClick={this.unfav}>
          <Icon name='star' color='yellow' size="large" />
        </Comment.Action>
      )
    } else {
      return (
        <Comment.Action onClick={this.fav}>
          <Icon name='empty star' size="large" />
        </Comment.Action>
      )
    }
  }

  render() {
    const { list = false, favButton = true, followButton = true, post, onClickUser } = this.props
    return (
      <Comment.Group>
        <Comment>
          <Comment.Content>
            <Comment.Author as={React.a} href='#' onClick={(e) => {
              e.preventDefault()
              onClickUser()
            }}>
              {post.user.display} <small>@{post.user.name}</small>
            </Comment.Author>
            <Comment.Text>
              <PostAddresses addresses={post.post_addresses} />
              <pre>
                <Linkify properties={{target: '_blank'}}>
                  {post.text}
                </Linkify>
              </pre>
            </Comment.Text>
            {favButton ? <Comment.Actions>{this.renderFavButton()}</Comment.Actions> : null}
          </Comment.Content>
        </Comment>
      </Comment.Group>
    )
  }
}

const user = React.PropTypes.shape({
  name: React.PropTypes.string.isRequired,
  display: React.PropTypes.string.isRequired
})
Post.propTypes = {
  followButton: React.PropTypes.bool,
  favButton: React.PropTypes.bool,
  post: React.PropTypes.shape({
    post_addresses: React.PropTypes.arrayOf(React.PropTypes.shape({
      user
    })),
    user: user.isRequired,
    text: React.PropTypes.string.isRequired,
  }),
  onClickUser: React.PropTypes.func.isRequired
}

export default connect(mapStateToProps, actionCreators)(Post)
