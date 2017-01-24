import React from 'react'
import { connect } from 'react-redux'

import Post from './Post.js'
import UserButton from './UserButton.js'

const mapStateToProps = ({ notices: { fav, favs }}) => {
  return { fav, favs }
}

const actionCreators = {
}

const FavNotices = ({ fav, favs }) => (
  <div>
    <h2>Favs</h2>
    {
      favs.map(fav => {
        return (
          <div key={fav.id}>
            <hr />
            <UserButton
              className="link"
              user={fav.user}
            >
              {fav.user.display}
            </UserButton>
            (@{fav.user.name})
            favorited
            <div style={{marginLeft: "20px"}}>
              <Post
                favButton={false}
                post={fav.post}
                onClickUser={() => {}}
              />
            </div>
          </div>
        )
      })
    }
  </div>
)

export default connect(mapStateToProps, actionCreators)(FavNotices)
