import React, { Component } from 'react'
import { connect } from 'react-redux'
import Linkify from 'react-linkify'

import { Comment, Icon, Segment } from 'semantic-ui-react'

import Time from './Time.js'
import FollowButton from './FollowButton.js'
import UserButton from './UserButton.js'
import NewPost from './NewPost.js'
import { requestFav, requestUnfav, setAddressPost, sendToOnline } from '../actions.js'
import { userPage, postPage } from '../pages.js'
import { userSelector, favsSelector } from '../selectors.js'
import { getTweetURL } from '../utils.js'

const mapStateToProps = (state) => {
  const favs = favsSelector(state)
  return {
    favs
  }
}

const actionCreators = {
  requestFav, requestUnfav, setAddressPost, sendToOnline,
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
    this.openQuote = this.openQuote.bind(this)
    this.closeQuote = this.closeQuote.bind(this)
    this.handleClickUser = this.handleClickUser.bind(this)
    this.handleClickTime = this.handleClickTime.bind(this)
    this.handleSendToOnline = this.handleSendToOnline.bind(this)
    this.state = {
      openReply: false,
      openQuote: false
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
    this.setState({openReply: true, openQuote: false})
  }

  closeReply() {
    this.setState({openReply: false})
  }

  openQuote() {
    this.setState({openQuote: true, openReply: false})
  }

  closeQuote() {
    this.setState({openQuote: false})
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

  handleSendToOnline() {
    const { post, sendToOnline } = this.props
    sendToOnline(post.id)
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

  renderQuoteButton() {
    const { post } = this.props
    const { openQuote } = this.state
    if (openQuote) {
      return (
        <Comment.Action onClick={this.closeQuote}>
          <Icon name='quote right' size='large' color='blue' />
        </Comment.Action>
      )
    } else {
      return (
        <Comment.Action onClick={this.openQuote}>
          <Icon name='quote right' size='large' />
        </Comment.Action>
      )
    }
  }

  renderChildPost(actions, size) {
    const { post } = this.props
    return (
      <Segment size={size}>
        <ConnectedPost
          actions={actions}
          post={post.post}
        />
      </Segment>
    )
  }

  render() {
    const {
      list = false, followButton = true, actions = true, postLink = true,
      attributeIcon, prefix, post, userPageAction
    } = this.props
    const { openReply, openQuote } = this.state
    const reply = post.post && post.post_addresses.length >= 1
    const quote = post.post && post.post_addresses.length == 0
    const size = quote ? null : 'tiny'
    const userDisplay = post.user_display || post.user.display
    return (
      <Comment.Group style={{padding: '0px', maxWidth: 'initial'}}>
        <Comment>
          <Comment.Content>
            {reply ? this.renderChildPost(quote, size) : null}
            {prefix}
            <Comment.Author as={React.a} href={userPage.path({name: post.user.name})} onClick={this.handleClickUser}>
              {userDisplay}
            </Comment.Author>
            <Comment.Metadata>
              <span>@{post.user.name}</span>
              {postLink ? (
                <a href={postPage.path({id: post.id})} onClick={this.handleClickTime}>
                  <Time time={post.inserted_at} />
                </a>
              ) : (
                <Time time={post.inserted_at} />
              )}
              {quote ? (
                <Icon name='quote right' size='big' />
              ) : null}
              {followButton ? (
                <FollowButton user={post.user} />
              ) : null}
              {attributeIcon ? (
                <Icon name={attributeIcon} color='blue' size='large' />
              ) : null}
            </Comment.Metadata>
            <Comment.Text>
              {!reply ? (
                <PostAddresses addresses={post.post_addresses} />
              ) : null}
              {post.text ? (
                <pre>
                  <Linkify properties={{target: '_blank'}}>
                    {post.text}
                  </Linkify>
                </pre>
              ) : null}
              {quote ? this.renderChildPost(quote, size) : null}
            </Comment.Text>
            {actions && post.text ? (
              <Comment.Actions>
                {this.renderReplyButton()}
                {this.renderFavButton()}
                {this.renderQuoteButton()}
                <Comment.Action onClick={this.handleSendToOnline}>
                  <Icon name='bar' size='large' />
                </Comment.Action>
                <Comment.Action as='a' href={getTweetURL(postPage.path({id: post.id}))} target='_blank'>
                  <Icon name='twitter' size='large' />
                </Comment.Action>
              </Comment.Actions>
            ): null}
            { openReply ? (
              <NewPost
                rows={3}
                reply={post}
                post={post}
                onSubmitHandler={this.closeReply}
              />
            ) : null }
            { openQuote ? (
              <NewPost
                rows={3}
                post={post}
                allowEmpty
                onSubmitHandler={this.closeQuote}
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

const ConnectedPost = connect(mapStateToProps, actionCreators)(Post)

ConnectedPost.propTypes = {
  prefix: React.PropTypes.node,
  attributeIcon: React.PropTypes.string,
  followButton: React.PropTypes.bool,
  actions: React.PropTypes.bool,
  post: React.PropTypes.shape({
    post_addresses: React.PropTypes.arrayOf(React.PropTypes.shape({
      user
    })),
    user: user.isRequired,
    text: React.PropTypes.string,
  })
}

export default ConnectedPost
