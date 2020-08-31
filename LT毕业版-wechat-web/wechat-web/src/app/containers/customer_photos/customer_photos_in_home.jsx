import './index.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions.js'
import { withRouter, browserHistory } from 'react-router'
import WithShareListHandler from '../../components/HOC/withShareListHandler'
import ProductsLoading from 'src/app/containers/products/products_loading/index'
import ResponsiveInfiniteScroll from 'src/app/components/shared/responsive_infinite_scroll'
import CustomerPhotosInHomeItem from 'src/app/components/customer_photos/customer_photos_in_home/item'
import CustomerPhotosInHomeBanner from 'src/app/components/customer_photos/customer_photos_in_home/banner'
import CustomerPhotosInHomeButton from 'src/app/components/customer_photos/customer_photos_in_home/bottom_button'
import CustomerPhotosInHomeMyCenterBanner from 'src/app/components/customer_photos/customer_photos_in_home/my_center_banner.jsx'

function mapStateToProps(state) {
  return {
    ...state.homePageCustomerPhotos,
    platform: state.app.platform,
    customer: state.customer
  }
}
@connect(mapStateToProps)
class CustomerPhotosInHome extends React.Component {
  componentDidMount() {
    const { page } = this.props.filters
    if (page === 1) {
      this.getHomeCustomerPhotos()
    }
  }

  getHomeCustomerPhotos = () => {
    const { filters, dispatch } = this.props
    const variable = { page: filters.page, per_page: filters.per_page }
    dispatch(Actions.customerPhotosSummary.getHomeCustomerPhotos(variable))
  }

  fetchMorePhotos = () => {
    this.getHomeCustomerPhotos()
  }
  didSelectedCustomerPhoto = async id => {
    const path = {
      pathname: '/customer_photo_details',
      query: {
        customer_photo_id: id
      }
    }
    await this.props.dispatch(
      Actions.customerPhotosSummary.resetCustomerPhotosDetails()
    )
    browserHistory.push(path)
  }

  render() {
    const {
      more,
      loading,
      platform,
      ShareList,
      share_topics,
      customer_photos,
      isShowCustomerPhotosBottomButton
    } = this.props
    const isJdEnv = platform === 'jd'
    return (
      <>
        <CustomerPhotosInHomeBanner
          isJdEnv={isJdEnv}
          shareTopics={share_topics}
        />
        {this.props.isSubscriber && (
          <CustomerPhotosInHomeMyCenterBanner customer={this.props.customer} />
        )}
        <ResponsiveInfiniteScroll
          onScrollToBottom={this.fetchMorePhotos}
          isLoading={loading}
          isMore={more}
        >
          <div className="list-content">
            <div className="list-container">
              {!_.isEmpty(customer_photos) &&
                _.map(customer_photos, (item, index) => {
                  return (
                    <CustomerPhotosInHomeItem
                      item={item}
                      key={index}
                      didSelectedCustomerPhoto={this.didSelectedCustomerPhoto}
                    />
                  )
                })}
            </div>
            {loading && <ProductsLoading />}
          </div>
        </ResponsiveInfiniteScroll>
        {isShowCustomerPhotosBottomButton && !isJdEnv && (
          <CustomerPhotosInHomeButton
            customer={this.props.customer}
            onClick={() => ShareList.toShareListLink()}
            showIncentive={ShareList.showShareIncentive}
          />
        )}
      </>
    )
  }
}

CustomerPhotosInHome.propTypes = {
  isShowCustomerPhotosBottomButton: PropTypes.bool.isRequired
}

CustomerPhotosInHome.defaultProps = {
  isShowCustomerPhotosBottomButton: false
}

export default WithShareListHandler(withRouter(CustomerPhotosInHome))
