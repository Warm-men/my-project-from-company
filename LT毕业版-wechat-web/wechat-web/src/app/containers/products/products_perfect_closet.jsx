import Actions from 'src/app/actions/actions.js'
import { connect } from 'react-redux'
import ProductsContainer from 'src/app/containers/products/products_container'
import Products from 'src/app/containers/products/products'
import ClosetHeader from 'src/app/containers/products/components/closet'
import GeneralWxShareHOC from 'src/app/components/HOC/GeneralWxShare'
import authentication from 'src/app/lib/authentication'
import { withRouter } from 'react-router'
import initScrollTop from 'src/app/lib/init_scroll_to_top.js'
//FIXME：分页方面目前后台返回25个closet，后面需要调整，因为productlist需要用对应id判断

@connect(mapStateToProps)
@GeneralWxShareHOC
@withRouter
export default class ProductsByCloset extends ProductsContainer {
  constructor(props) {
    super(props)
    this.state = {
      sort: _.isEmpty(props.products[this.pathname])
        ? 'perfect_stock_first'
        : props.sort
    }
  }

  componentDidMount() {
    const { products, hasChangeFilters } = this.props
    this.initWechatShare && this.initWechatShare()
    if (_.isEmpty(products[this.pathname])) {
      !hasChangeFilters && this.initialProducts()
    } else {
      initScrollTop(100)
    }
    // NOTE: 从筛选页返回
    if (hasChangeFilters) {
      this.clearProducts()
      this.fetchProducts()
    }
  }

  fetchProducts() {
    const {
      filters_occasion,
      the_second_level,
      filters,
      dispatch,
      location
    } = this.props
    const { perfect_filter_terms } = location.query
    dispatch(
      Actions.mycloset.fetchPerfectCloset(
        { ...filters, sort: this.state.sort },
        filters_occasion,
        the_second_level,
        perfect_filter_terms
      )
    )
  }

  onChangeSwitchValue = sort => {
    const { dispatch } = this.props
    this.setState({ sort })
    dispatch(Actions.mycloset.setPerfectClosetSort(sort))
  }

  render() {
    const { customer, location } = this.props
    const products = this.props.products[this.pathname]
    const isEmpty = _.isEmpty(products)
    const { perfect_closet_stats } = customer
    return (
      <>
        <ClosetHeader
          perfect_closet_stats={perfect_closet_stats}
          perfectCloset={true}
          onChangeSwitchValue={this.onChangeSwitchValue}
          sort={this.state.sort}
          location={location}
        />
        <Products
          {...this.props}
          products={isEmpty ? [] : products}
          isCloset={true}
          isShowCart={true}
          buttons={this.handleButtons()}
          toggleCloset={this.toggleCloset}
          showFilterModal={this.showFilterModal}
          fetchProducts={this.fetchMoreProducts}
          hideFilterModal={this.hideFilterModal}
        />
      </>
    )
  }
}

function mapStateToProps(state) {
  const { allproducts, customer, closet, tote_cart, totes, myCloset } = state
  return {
    ...allproducts,
    productsTitle: '满分单品',
    productsEmptyText: ' ',
    closetProductIds: closet.productIds,
    fetchMoreProducts: true,
    customer,
    customerSignedIn: !!customer.id,
    isShowStock: true,
    authentication: authentication(customer),
    tote_cart,
    totes,
    sort: myCloset.perfect_closet_sort
  }
}
