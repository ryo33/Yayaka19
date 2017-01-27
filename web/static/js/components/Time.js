import React from 'react'
import moment from 'moment'
import TimeAgo from 'react-timeago'

const Time = ({ time }) => (
  <TimeAgo date={moment.utc(time).format()} />
)

Time.propTypes = {
  time: React.PropTypes.string.isRequired
}

export default Time
