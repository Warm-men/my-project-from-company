import PropTypes from 'prop-types'

const CustomerPhotosDetailItemDescription = props => {
  const { content, share_topics, linkTitle } = props
  const title =
    !!share_topics.length && share_topics[0] && share_topics[0].title
  return (
    <div className="description-contents">
      {title && (
        <span className="topic" onClick={linkTitle}>
          {title}
        </span>
      )}
      <span className="description"> {content}</span>
    </div>
  )
}

export default React.memo(CustomerPhotosDetailItemDescription)

CustomerPhotosDetailItemDescription.propTypes = {
  share_topics: PropTypes.array.isRequired
}

CustomerPhotosDetailItemDescription.defaultProps = {
  share_topics: [
    {
      title: '',
      url: 'https:/'
    }
  ]
}
