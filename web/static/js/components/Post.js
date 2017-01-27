import React, { Component } from 'react'
import { connect } from 'react-redux'
import Linkify from 'react-linkify'

import { Comment, Icon, Segment } from 'semantic-ui-react'

import Time from './Time.js'
import FollowButton from './FollowButton.js'
import UserButton from './UserButton.js'
import NewPost from './NewPost.js'
import { requestFav, requestUnfav, setAddressPost } from '../actions.js'
import { userPage } from '../pages.js'
import { userSelector, favsSelector } from '../selectors.js'

const mapStateToProps = (state) => {
  const favs = favsSelector(state)
  return {
    favs
  }
}

const actionCreators = {
  requestFav, requestUnfav, setAddressPost, userPageAction: userPage.action
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
      post, onClickUser, userPageAction
    } = this.props
    const { openReply } = this.state
    return (
      <Comment.Group style={{padding: '0px'}}>
        <Comment>
          <Comment.Content>
            <Comment.Author as={React.a} href='#' onClick={(e) => {
              e.preventDefault()
              onClickUser()
            }}>
              {post.user.display}
            </Comment.Author>
            <Comment.Metadata>
              <span>@{post.user.name}</span>
              <Time time={post.inserted_at} />
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
                  <Post
                    favButton={false}
                    replyButton={false}
                    post={post.post}
                    onClickUser={() => userPageAction(post.post.user.name)}
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
  }),
  onClickUser: React.PropTypes.func.isRequired
}

export default connect(mapStateToProps, actionCreators)(Post)
