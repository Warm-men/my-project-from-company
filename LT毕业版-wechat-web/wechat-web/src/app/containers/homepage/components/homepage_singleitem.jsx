import React from 'react'
import Actions from 'src/app/actions/actions'
import { connect } from 'react-redux'
import ProductList from './products_list'
import '../index.scss'

class HomepageSingleItem extends React.Component {
  componentDidMount() {
    this.getSingleItem()
  }

  shouldComponentUpdate(nextProps) {
    // NOTE：推荐单品的update处理
    const { singleItem, customer, closetProductIds } = nextProps
    if (
      closetProductIds.length === this.props.closetProductIds.length &&
      singleItem === this.props.singleItem &&
      Object.is(customer.shipping_address, this.props.customer.shipping_address)
    ) {
      return false
    }
    return true
  }

  componentDidUpdate() {
    this.getSingleItem()
  }

  getSingleItem = () => {
    const { singleItem, customer } = this.props
    const { style, shipping_address } = customer
    let isHadAddress = false
    if (!_.isEmpty(shipping_address)) {
      isHadAddress =
        !_.isEmpty(shipping_address.city) && !_.isEmpty(shipping_address.state)
    }
    const isHadSize = !_.isEmpty(style.top_size) && !!style.dress_size
    if (!singleItem && isHadSize && isHadAddress) {
      this.props.dispatch(Actions.homepage.singleItem('trending_near_you'))
    }
  }

  render() {
    const { singleItem, closetProductIds } = this.props
    if (_.isEmpty(singleItem) || _.isEmpty(singleItem.products)) {
      return null
    }
    return (
      <ProductList
        title="为你推荐"
        title_content="RECOMMENDATION"
        getReportData={{
          filter_and_sort: 'trending_near_you',
          router: '/',
          column_name: 'Recommend',
          page_type: 'list'
        }}
        products={singleItem.products}
        closetProductIds={closetProductIds}
      />
    )
  }
}

function mapStateToProps(state) {
  const { homepage, closet, customer } = state
  return {
    singleItem: homepage.singleItem,
    closetProductIds: closet.productIds,
    customer
  }
}

export default connect(mapStateToProps)(HomepageSingleItem)
