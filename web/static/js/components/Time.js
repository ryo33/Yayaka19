import React from 'react'

import TimeAgo from 'react-timeago'

const Time = ({ time }) => (
  <TimeAgo date={new Date(time + 'z')} />
)

Time.propTypes = {
  time: React.PropTypes.string.isRequired
}

export default Time
