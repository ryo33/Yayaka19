import React, { Component } from 'react'
import { connect } from 'react-redux'

import { requestFav, requestUnfav } from '../actions.js'
import { userSelector, favsSelector } from '../selectors.js'

const mapStateToProps = (state) => {
  const user = userSelector(state)
  const favs = favsSelector(state)
  return {
    user,
    favs
  }
}

const actionCreators = {
  requestFav, requestUnfav
}

class FavButton extends Component {
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

  render() {
    const { user, favs, post } = this.props
    if (user == null) {
      return null
    }
    if (favs.includes(post.id)) {
      return (
        <button className="unfav" onClick={this.unfav}><span /></button>
      )
    } else {
      return (
        <button className="fav" onClick={this.fav}><span /></button>
      )
    }
  }
}

const component = connect(mapStateToProps, actionCreators)(FavButton)

component.propTypes = {
  post: React.PropTypes.object.isRequired,
}

export default component

