import React, { Component } from 'react'
import { connect } from 'react-redux'
import Linkify from 'react-linkify'

import { Comment, Icon, Segment, Button } from 'semantic-ui-react'

import UserID from './UserID.js'
import Time from './Time.js'
import FollowButton from './FollowButton.js'
import UserButton from './UserButton.js'
import NewPost from './NewPost.js'
import Mystery from './Mystery.js'
import { requestFav, requestUnfav, setAddressPost, submitPost } from '../actions/index.js'
import { userPage, postPage } from '../pages.js'
import { userSelector, favsSelector } from '../selectors.js'
import { getTweetURL, createRemotePath } from '../utils.js'

const getPostPath = ({ id, host, path }) =>
  host != null ? `https://${host+path}` : postPage.path({id})

const mapStateToProps = (state) => {
  const favs = favsSelector(state)
  return {
    favs
  }
}

const actionCreators = {
  requestFav, requestUnfav, setAddressPost,
  userPageAction: name => userPage.action({name}),
  postPageAction: id => postPage.action({id}),
  submitPost
}

const PostAddresses = ({ host, addresses = [] }) => (
  <div>
    {
      addresses.map(({ user }) => (
        <span key={user.name}>
          <UserButton host={host} user={user}>
            <Icon name='send' />
            {user.display} (<UserID user={user} />)
          </UserButton>
        </span>
      ))
    }
  </div>
)

const PostLink = ({ post, host, onClick }) => {
  const { path, inserted_at, id } = post
  if (host) {
    return (
      <a href={createRemotePath(host, path)}>
        <Icon name='external' />
        <Time time={post.inserted_at} />
      </a>
    )
  } else {
    return (
      <a href={postPage.path({id})} onClick={onClick}>
        <Time time={post.inserted_at} />
      </a>
    )
  }
}

const ChildPost = ({ postPageAction, post, host, actions, size }) => {
  const notLoaded = post.post_id != null && post.post == null
  if (notLoaded) {
    if (host) {
      return (
        <Segment size={size}>
          <Button as='a' href={createRemotePath(host, post.path)}>
            <Icon name='external' />
            Load More
          </Button>
        </Segment>
      )
    } else {
      return (
        <Segment size={size}>
          <Button onClick={() => postPageAction(post.id)}>Load More</Button>
        </Segment>
      )
    }
  } else {
    return (
      <Segment size={size}>
        <ConnectedPost
          host={host}
          actions={actions}
          post={post.post}
        />
      </Segment>
    )
  }
}

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
    this.handleEmptyQuote = this.handleEmptyQuote.bind(this)
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
    const { post, postPageAction } = this.props
    if (post.host == null) {
      e.preventDefault()
      postPageAction(post.id)
    }
  }

  handleEmptyQuote() {
    const { post, submitPost } = this.props
    submitPost('', '', post.id)
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

  render() {
    const {
      list = false, followButton = true, actions = true, postLink = true,
      attributeIcon, prefix, post, userPageAction, postPageAction
    } = this.props
    const { openReply, openQuote } = this.state
    const host = post.host || this.props.host
    const remote = host != null
    const hasChild = post.post != null || post.post_id != null
    const reply = hasChild && post.post_addresses.length >= 1
    const quote = hasChild && post.post_addresses.length == 0
    const quoteMystery = post.mystery_id != null
    const empty = !quoteMystery && (post.text ? post.text.length === 0 : true)
    const size = quote ? null : 'tiny'
    const userDisplay = post.user_display || post.user.display
    return (
      <Comment.Group style={{padding: '0px', maxWidth: 'initial'}}>
        <Comment>
          <Comment.Content>
            {reply ? (
              <ChildPost
                post={post}
                postPageAction={postPageAction}
                host={host}
                address={quote}
                size={size}
              />
            ) : null}
            {prefix}
            {quote ? (
              <Icon name={empty ? 'retweet' : 'quote right'}
                size='large' color='blue' />
            ) : null}
            <UserButton Component={Comment.Author} host={host} user={post.user}>
              {userDisplay}
            </UserButton>
            <Comment.Metadata>
              <UserID host={host} user={post.user} />
              {postLink ? (
                <PostLink
                  post={post}
                  host={host}
                  onClick={this.handleClickTime}
                />
              ) : (
                <Time time={post.inserted_at} />
              )}
              {followButton ? (
                <FollowButton user={post.user} />
              ) : null}
              {attributeIcon ? (
                <Icon name={attributeIcon} color='blue' size='large' />
              ) : null}
            </Comment.Metadata>
            <Comment.Text>
              {!reply ? (
                <PostAddresses host={host} addresses={post.post_addresses} />
              ) : null}
              {post.text ? (
                <pre>
                  <Linkify properties={{target: '_blank'}}>
                    {post.text}
                  </Linkify>
                </pre>
              ) : null}
              {quote ? (
                <ChildPost
                  post={post}
                  postPageAction={postPageAction}
                  host={host}
                  address={quote}
                  size={size}
                />
              ) : null}
              {post.mystery ? (
                <Segment>
                  <Mystery host={host} mystery={post.mystery} />
                </Segment>
              ) : null}
            </Comment.Text>
            {actions && !remote && post.text ? (
              <Comment.Actions>
                {this.renderReplyButton()}
                {this.renderFavButton()}
                {this.renderQuoteButton()}
                <Comment.Action onClick={this.handleEmptyQuote}>
                  <Icon name='retweet' size='large' />
                </Comment.Action>
                <Comment.Action as='a' href={getTweetURL(post)} target='_blank'>
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
