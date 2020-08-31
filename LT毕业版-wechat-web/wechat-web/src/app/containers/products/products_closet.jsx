import Actions from 'src/app/actions/actions.js'
import { connect } from 'react-redux'
import ProductsContainer from 'src/app/containers/products/products_container'
import Products from 'src/app/containers/products/products'
import ClosetHeader from 'src/app/containers/products/components/closet'
import GeneralWxShareHOC from 'src/app/components/HOC/GeneralWxShare'
import authentication from 'src/app/lib/authentication'
import { withRouter } from 'react-router'
import initScrollTop from 'src/app/lib/init_scroll_to_top.js'
import ProductsClosetEmpty from './products_closet_empty'
import { nothingFilterItemIsSelected } from 'src/app/lib/filters'
//FIXME：分页方面目前后台返回25个closet，后面需要调整，因为productlist需要用对应id判断

@connect(mapStateToProps)
@GeneralWxShareHOC
@withRouter
export default class ProductsByCloset extends ProductsContainer {
  constructor(props) {
    super(props)
    this.state = {
      isFirstRequest: true,
      showEmptyView: false,
      sort: _.isEmpty(props.products[this.pathname])
        ? 'closet_stock_first'
        : props.sort
    }
  }

  componentDidMount() {
    const { products, hasChangeFilters } = this.props

    //设置分享
    this.initWechatShare && this.initWechatShare()

    //判断是否初始化数据
    if (_.isEmpty(products[this.pathname])) {
      !hasChangeFilters && this.initialProducts()
    } else {
      //返回到愿望衣橱页面
      initScrollTop(100)
      this._handleFirstRespones()
    }
    //从筛选页返回
    if (hasChangeFilters) {
      this.clearProducts()
      this.fetchProducts()
    }
  }

  fetchProducts = () => {
    const {
      dispatch,
      filters_occasion,
      the_second_level,
      filters,
      filter_terms
    } = this.props
    dispatch(
      Actions.mycloset.fetchWishingCloset(
        { ...filters, sort: this.state.sort },
        filters_occasion,
        the_second_level,
        filter_terms,
        this.fetchClosetSuccess,
        this.fetchClosetFailure
      )
    )
  }

  fetchClosetSuccess = () => {
    this._handleFirstRespones()
  }

  fetchClosetFailure = () => {
    this._handleFirstRespones()
  }

  _handleFirstRespones = () => {
    const { products, filters_occasion, filter_terms, filters } = this.props
    const { perfect_closet_stats } = this.props.customer

    const isEmptyCloset = _.isEmpty(products[this.pathname])
    const isEmptyPerfect = this.isEmptyForPerfectCloset(perfect_closet_stats)
    const isEmptyFilters = nothingFilterItemIsSelected(
      filters,
      filters_occasion
    )
    const isEmpty = isEmptyCloset && isEmptyPerfect && isEmptyFilters

    const data = { isFirstRequest: false }
    if (this.state.isFirstRequest) {
      if (isEmpty && filter_terms === 'all') {
        data.showEmptyView = true
      }
    }
    this.setState(data)
  }

  onChangeSwitchValue = sort => {
    const { dispatch } = this.props
    this.setState({ sort })
    dispatch(Actions.mycloset.setWishingClosetSort(sort))
  }

  isEmptyForPerfectCloset = data => {
    const { clothing_count, accessory_count, product_count } = data
    return product_count === 0 && clothing_count === 0 && accessory_count === 0
  }

  render() {
    const { location, customer, isFromSwap } = this.props
    const products = this.props.products[this.pathname]
    const { perfect_closet_stats } = customer

    const isEmptyCloset = _.isEmpty(products)

    if (this.state.isFirstRequest) {
      return (
        <div className="loading-view">
          <img src={require('./products_loading/loading.gif')} alt="" />
        </div>
      )
    }
    if (this.state.showEmptyView) {
      return <ProductsClosetEmpty isFromSwap={isFromSwap} />
    } else {
      return (
        <>
          <ClosetHeader
            location={location}
            perfectCloset={false}
            sort={this.state.sort}
            perfect_closet_stats={perfect_closet_stats}
            onChangeSwitchValue={this.onChangeSwitchValue}
          />
          <Products
            {...this.props}
            products={isEmptyCloset ? [] : products}
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
}

function mapStateToProps(state) {
  const { allproducts, customer, closet, tote_cart, totes, myCloset } = state
  return {
    ...allproducts,
    productsTitle: '愿望衣橱',
    productsEmptyText: ' ',
    closetProductIds: closet.productIds,
    customer,
    customerSignedIn: !!customer.id,
    isShowStock: true,
    fetchMoreProducts: true,
    authentication: authentication(customer),
    tote_cart,
    totes,
    sort: myCloset.wishing_closet_sort,
    filter_terms: myCloset.wishing_closet_filter
  }
}
