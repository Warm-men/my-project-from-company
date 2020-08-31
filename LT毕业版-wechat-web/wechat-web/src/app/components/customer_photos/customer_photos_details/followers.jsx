import PropTypes from 'prop-types'
import LikeButton from 'src/app/containers/customer_photos/like_button.jsx'
import Headportrait from 'src/assets/images/account/mine_headportrait.svg'

class CustomerPhotosDetailItemFollowers extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      like_customers: props.like_customers,
      likes_count: props.likes_count
    }
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.like_customers, this.props.like_customers)) {
      this.setState({
        like_customers: this.props.like_customers,
        likes_count: this.props.likes_count
      })
    }
  }

  updateLikeCustomers = like_customers => {
    this.setState(state => ({
      like_customers,
      likes_count: !_.isEmpty(like_customers)
        ? state.likes_count + 1
        : state.likes_count - 1
    }))
  }
  render() {
    const { liked, maxLength, id, isOwnShare } = this.props
    const { like_customers, likes_count } = this.state
    const item = {
      id,
      liked,
      likes_count
    }
    return (
      <div className="followers-contents">
        {likes_count > 0 ? (
          <div className="follower-img-view">
            {like_customers.map((item, index) => {
              if (index > maxLength) return null
              if (index + 1 > maxLength)
                return (
                  <span key={index} className="more-follower">
                    ...
                  </span>
                )
              const avatarImg = item.avatar || Headportrait
              return (
                <div
                  key={index}
                  className="follower-img"
                  style={{ backgroundImage: `url(${avatarImg})` }}
                />
              )
            })}
          </div>
        ) : (
          <div className="follower-tips-text">
            {isOwnShare
              ? `你的穿搭真好看，快来给自己点个赞吧`
              : `你的赞美至关重要，快来给她点赞吧`}
          </div>
        )}
        <LikeButton
          item={item}
          inDetails={true}
          updateLikeCustomers={this.updateLikeCustomers}
        />
      </div>
    )
  }
}

export default CustomerPhotosDetailItemFollowers

CustomerPhotosDetailItemFollowers.propTypes = {
  like_customers: PropTypes.array,
  maxLength: PropTypes.number.isRequired
}

CustomerPhotosDetailItemFollowers.defaultProps = {
  like_customers: [
    {
      avatar: 'https://'
    }
  ],
  maxLength: 6
}
