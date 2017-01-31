import React, { Component } from 'react'
import { connect } from 'react-redux'
import Linkify from 'react-linkify'

import { Comment, Icon, Segment } from 'semantic-ui-react'

import Time from './Time.js'
import FollowButton from './FollowButton.js'
import UserButton from './UserButton.js'
import NewPost from './NewPost.js'
import { requestFav, requestUnfav, setAddressPost } from '../actions.js'
import { userPage, postPage } from '../pages.js'
import { userSelector, favsSelector } from '../selectors.js'

const mapStateToProps = (state) => {
  const favs = favsSelector(state)
  return {
    favs
  }
}

const actionCreators = {
  requestFav, requestUnfav, setAddressPost,
  userPageAction: name => userPage.action({name}),
  postPageAction: id => postPage.action({id})
}

const PostAddresses = ({ addresses = [] }) => (
  <div>
    {
      addresses.map(({ user }) => (
        <span key={user.name}>
          <UserButton user={user} className='link'>
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
    this.openReply = this.openReply.bind(this)
    this.closeReply = this.closeReply.bind(this)
    this.handleClickUser = this.handleClickUser.bind(this)
    this.handleClickTime = this.handleClickTime.bind(this)
    this.state = {
      openReply: false
    }
  }

  fav() {
    const { requestFav, post } = this.props
    requestFav(post.id)
  }

  unfav() {
    const { requestUnfav, post } = this.props
    requestUnfav(post.id)
  }

  openReply() {
    const { setAddressPost, post } = this.props
    this.setState({openReply: true})
  }

  closeReply() {
    const { setAddressPost, post } = this.props
    this.setState({openReply: false})
  }

  handleClickUser(e) {
    e.preventDefault()
    const { post, userPageAction } = this.props
    userPageAction(post.user.name)
  }

  handleClickTime(e) {
    e.preventDefault()
    const { post, postPageAction } = this.props
    postPageAction(post.id)
  }

  renderReplyButton() {
    const { post } = this.props
    const { openReply } = this.state
    if (openReply) {
      return (
        <Comment.Action onClick={this.closeReply}>
          <Icon name='reply' size='large' color='blue' />
        </Comment.Action>
      )
    } else {
      return (
        <Comment.Action onClick={this.openReply}>
          <Icon name='reply' size='large' />
        </Comment.Action>
      )
    }
  }

  renderFavButton() {
    const { favs, post } = this.props
    if (favs.includes(post.id)) {
      return (
        <Comment.Action onClick={this.unfav}>
          <Icon name='star' color='yellow' size='large' />
        </Comment.Action>
      )
    } else {
      return (
        <Comment.Action onClick={this.fav}>
          <Icon name='empty star' size='large' />
        </Comment.Action>
      )
    }
  }

  render() {
    const {
      list = false, favButton = true, followButton = true, replyButton = true,
      post, userPageAction
    } = this.props
    const { openReply } = this.state
    return (
      <Comment.Group style={{padding: '0px'}}>
        <Comment>
          <Comment.Content>
            <Comment.Author as={React.a} href='#' onClick={this.handleClickUser}>
              {post.user.display}
            </Comment.Author>
            <Comment.Metadata>
              <span>@{post.user.name}</span>
              <a href='#' onClick={this.handleClickTime}>
                <Time time={post.inserted_at} />
              </a>
              {followButton ? (
                <FollowButton user={post.user} />
              ) : null}
            </Comment.Metadata>
            <Comment.Text>
              <PostAddresses addresses={post.post_addresses} />
              <pre style={{
                marginBottom: '0px',
                overflow: 'auto',
                wordWrap: 'normal',
                whiteSpace: 'pre-wrap',
                fontSize: '1.1em'
              }}>
                <Linkify properties={{target: '_blank'}}>
                  {post.text}
                </Linkify>
              </pre>
              {post.post ? (
                <Segment size='tiny'>
                  <ConnectedPost
                    favButton={false}
                    replyButton={false}
                    post={post.post}
                  />
                </Segment>
              ) : null}
            </Comment.Text>
            <Comment.Actions>
              {replyButton ? this.renderReplyButton() : null}
              {favButton ? this.renderFavButton() : null}
            </Comment.Actions>
            { openReply ? (
              <NewPost
                post={post}
                onSubmitHandler={this.closeReply}
              />
            ) : null }
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
  })
}

const ConnectedPost = connect(mapStateToProps, actionCreators)(Post)

export default ConnectedPost
