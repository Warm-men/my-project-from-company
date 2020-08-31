import PropTypes from 'prop-types'
import Actions from 'src/app/actions/actions.js'
import { connect } from 'react-redux'
import './index.scss'

function mapStateToProps(state) {
  return { customer: state.customer }
}
@connect(mapStateToProps)
class LikeButton extends React.Component {
  constructor(props) {
    super(props)
    const { liked, likes_count } = props.item
    this.state = { liked, likes_count }
  }

  toggleLike = e => {
    e.stopPropagation()
    const newLikedStatus = !this.state.liked
    this.setState({ liked: newLikedStatus })
    const input = { customer_photo_id: this.props.item.id }
    const action = newLikedStatus
      ? Actions.customerPhotosSummary.likeCustomerPhotos(
          { input },
          this.likeCustomerPhotosSuccess
        )
      : Actions.customerPhotosSummary.dislikeCustomerPhotos(
          { input },
          this.dislikeCustomerPhotosSuccess
        )
    this.props.dispatch(action)
  }

  likeCustomerPhotosSuccess = (dispatch, response) => {
    const { customer_photo } = response.data.LikeCustomerPhoto
    if (!customer_photo) return null

    const { updateLikeCustomers, updateCustomerPhotoDetails } = this.props

    const { like_customers, liked, likes_count, customer } = customer_photo
    updateLikeCustomers && updateLikeCustomers(like_customers)
    updateCustomerPhotoDetails && updateCustomerPhotoDetails()

    this.setState({ liked, likes_count })

    if (customer.id.toString() === this.props.customer.id.toString()) {
      dispatch(Actions.customerPhotosSummary.fetchMyCustomerPhotosInfo())
    }
  }

  dislikeCustomerPhotosSuccess = (dispatch, response) => {
    const { customer_photo } = response.data.DislikeCustomerPhoto
    if (!customer_photo) return null

    const { updateLikeCustomers, updateCustomerPhotoDetails } = this.props

    const { like_customers, liked, likes_count, customer } = customer_photo
    updateLikeCustomers && updateLikeCustomers(like_customers)
    updateCustomerPhotoDetails && updateCustomerPhotoDetails()

    this.setState({ liked, likes_count })

    if (customer.id.toString() === this.props.customer.id.toString()) {
      dispatch(Actions.customerPhotosSummary.fetchMyCustomerPhotosInfo())
    }
  }

  getButtonContent = () => {
    let content = ''
    const likesCount = this.state.likes_count
    if (likesCount === 0) {
      content = '赞'
    } else if (likesCount < 1000) {
      content = likesCount + ''
    } else {
      content = '999+'
    }
    return content
  }

  componentWillReceiveProps(nextProps) {
    const { liked, likes_count } = nextProps.item
    if (
      liked !== this.props.item.liked ||
      likes_count !== this.props.item.likes_count
    ) {
      this.setState({ liked, likes_count })
    }
  }

  render() {
    const { liked } = this.state
    const { inDetails } = this.props
    const likeIcon = inDetails
      ? liked
        ? require('./images/like-icon-in-details-on.png')
        : require('./images/like-icon-in-details-off.png')
      : liked
      ? require('./images/like-icon-in-home-on.png')
      : require('./images/like-icon-in-home-off.png')
    const likeCountStyle = liked
      ? inDetails
        ? 'like-count is-liked-in-details'
        : 'like-count is-liked'
      : 'like-count'
    const likeViewStyleInDetails = liked
      ? 'like-button-view-on'
      : 'like-button-view-off'
    const likeViewStyle = inDetails
      ? `like-button-container ${likeViewStyleInDetails}`
      : 'like-button-container'
    return (
      <div className={likeViewStyle} onClick={this.toggleLike}>
        <img src={likeIcon} alt="" className="icon" />
        <div className={likeCountStyle}>{this.getButtonContent()}</div>
      </div>
    )
  }
}

LikeButton.propTypes = {
  item: PropTypes.object
}

LikeButton.defaultProps = {
  item: {},
  updateLikeCustomers: () => {}
}

export default LikeButton
