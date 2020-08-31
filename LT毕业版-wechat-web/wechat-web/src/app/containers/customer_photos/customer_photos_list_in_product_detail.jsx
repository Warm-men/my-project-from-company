import React from 'react'
import PropTypes from 'prop-types'
import CustomerPhotosInProductItem from 'src/app/components/customer_photos/customer_photos_in_product_detail'
import ProductsLoading from 'src/app/containers/products/products_loading/index'
import Actions from 'src/app/actions/actions.js'
import { connect } from 'react-redux'
import './index.scss'

function mapStateToProps(state) {
  const { customerPhotosDetails } = state
  return {
    customerPhotosDetails
  }
}
@connect(mapStateToProps)
export default class CustomerPhotosInProduct extends React.Component {
  constructor(props) {
    super(props)
    this.state = { data: [], page: 1, limit: 2, isMore: true, isLoading: false }
  }

  componentDidUpdate(prevProps) {
    if (this.props.productId !== prevProps.productId) {
      this.setState({ page: 1, isMore: true, isLoading: false }, () => {
        this.panddingToGetCustomerPhotos()
      })
    }
  }
  componentDidMount() {
    this.panddingToGetCustomerPhotos()
  }

  panddingToGetCustomerPhotos = () => {
    const { isLoading } = this.state
    if (isLoading) {
      return null
    }
    this.setState({ isLoading: true }, this.getCustomerPhotos)
  }

  getCustomerPhotos = () => {
    const { dispatch, productId } = this.props
    if (!productId) return null

    const { page, limit } = this.state
    const variables = { id: productId, page, limit }
    dispatch(
      Actions.customerPhotosSummary.fetchCustomerPhotosInProduct(
        variables,
        this.getCustomerPhotosSuccess,
        () => {
          this.setState({ isLoading: false })
        }
      )
    )
  }

  getCustomerPhotosSuccess = (dis, res) => {
    const { customer_photos_v2 } = res.data.product
    const { data, page, limit } = this.state
    this.setState({
      data: page === 1 ? customer_photos_v2 : [...data, ...customer_photos_v2],
      page: page + 1,
      isMore: customer_photos_v2.length === limit,
      isLoading: false
    })
  }

  fetchMorePhotos = () => {
    if (this.state.isLoading) return null
    this.setState({ isLoading: true }, this.getCustomerPhotos)
  }

  updateCustomerPhotoDetails = () => {
    const { dispatch, customer_photo_id, customerPhotosDetails } = this.props
    if (!customer_photo_id) return null
    const { page, limit } = customerPhotosDetails
    const variables = { customer_photo_id }
    const customerPhotosSummaryVariables = { page, limit, customer_photo_id }
    dispatch(
      Actions.customerPhotosSummary.fetchCustomerPhotosDetailsFirst(
        variables,
        dispatch(
          Actions.customerPhotosSummary.fetchTheRelatedCustomerPhotos(
            customerPhotosSummaryVariables
          )
        )
      )
    )
  }

  render() {
    const { data, isLoading, isMore, page } = this.state
    const { customer_photos_pages } = this.props
    const isEndLoad = customer_photos_pages === page - 1
    if (_.isEmpty(data)) {
      return null
    }
    return (
      <div className="customer-photo-details-contents">
        <div className="description-title">精选晒单</div>
        <div className="list-view">
          {data.map((item, index) => {
            return (
              <CustomerPhotosInProductItem
                customerPhotosItem={item}
                key={index}
                updateCustomerPhotoDetails={this.updateCustomerPhotoDetails}
              />
            )
          })}
        </div>
        {isLoading && <ProductsLoading />}
        {isMore && !!data.length && !isLoading && !isEndLoad && (
          <div className="pull-more">
            <div className="wrapper-view" onClick={this.fetchMorePhotos}>
              <span className="more-text">查看更多晒单</span>
              <img
                src={require('src/assets/images/arrow.png')}
                alt=""
                className="more-arrow"
              />
            </div>
          </div>
        )}
        {isEndLoad && <div className="isEndLoad">已显示全部精选晒单</div>}
        <div className="bottomBorder" />
      </div>
    )
  }
}

CustomerPhotosInProduct.propTypes = {
  productId: PropTypes.number
}
