import React from 'react'
import Products from './products'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import { isSubscriber } from 'src/app/lib/authentication'
import initScrollTop from 'src/app/lib/init_scroll_to_top.js'

class ProductsContainer extends React.Component {
  constructor(props) {
    super()
    this.pathname = window.location.pathname
    this.initFilter = null
    this.isOnboardingSwap =
      props &&
      !isSubscriber(props.customer) &&
      props.customer.finished_onboarding_questions === 'ALL'
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

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(Actions.tips.changeTips({ isShow: false }))
  }

  initialProducts = async () => {
    await this.clearProductsAndFilterTerms()
    this.fetchProducts()
  }

  fetchProducts() {
    throw new Error('Override')
  }

  setFilters = filters => {
    this.props.dispatch(Actions.allproducts.setFilters(filters, false))
  }

  fetchMoreProducts = () => {
    const { filters, fetchMoreProducts } = this.props
    if (fetchMoreProducts) {
      this.setFilters({ page: filters.page + 1 })
      this.fetchProducts()
    }
  }

  clearProductsAndFilterTerms = () => {
    this.props.dispatch(Actions.allproducts.clearProductsAndFilterTerms())
  }

  clearProducts = () => {
    this.props.dispatch(Actions.allproducts.clearProducts(this.pathname))
  }

  toggleCloset = (id, reportData) => {
    const inCloset = _.includes(this.props.closetProductIds, id)
    if (inCloset) {
      this.props.dispatch(Actions.closet.remove([id]))
    } else {
      this.props.dispatch(Actions.closet.add([id], reportData))
    }
  }

  showFilterModal = () => {
    if (this.props.isOccasion) {
      browserHistory.push({
        pathname: '/filter_modal',
        query: { isOccasion: true }
      })
    } else {
      browserHistory.push('/filter_modal')
    }
  }

  intelligentSelect = () =>
    this.trackProductsSizeFilter(
      !this.props.customer.products_size_filter,
      this.handleTrackSuc,
      this.handleTrackErr
    )

  handleTrackSuc = (dispatch, resData) => {
    const data = resData.data.CreateCustomerProductsSizeFilter
    this.fetchProducts(1)
    if (!_.isEmpty(data.errors)) {
      this.props.dispatch(
        Actions.app.showGlobalHint({
          title: '智能选码',
          leftBtnText: '我知道了',
          rightBtnText: '去填写',
          leftButton: () => this.props.dispatch(Actions.app.resetGlobalHint()),
          rightButton: () => {
            this.props.dispatch(Actions.app.resetGlobalHint())
            browserHistory.push({
              pathname: '/style_profile/figure_input',
              query: {
                pre_page: 'products_size_filter'
              }
            })
          },
          children: (
            <div className="size-filter-hint">
              <i className="warn-icon" />
              &nbsp;{data.errors}
              <div className="warn-content">
                我们会综合尺码、版型和面料弹性等因素，帮你隐藏100%不合身的衣服哦
              </div>
            </div>
          )
        })
      )
      return null
    }
    dispatch(
      Actions.tips.changeTips({
        isShow: true,
        content: data.products_size_filter
          ? '已隐藏不合身商品'
          : '已显示全部商品',
        timer: 1
      })
    )
  }

  handleIKnow = () => {
    this.trackProductsSizeFilter(true)
    this.fetchProducts(1)
  }

  trackProductsSizeFilter = (products_size_filter, success, error) =>
    this.props.dispatch(
      Actions.products.productSizeFilter({
        products_size_filter,
        success,
        error
      })
    )

  gotoHome = () => browserHistory.push('/home')
  gotoNewTotes = () => browserHistory.push('/new_totes')
  handleButtons = () => {
    const { isNoSort, customer } = this.props
    return {
      index: !isNoSort
        ? {
            title: '首页',
            handleClick: this.gotoHome
          }
        : null,
      cart:
        customer && customer.display_cart_entry
          ? {
              title: '新衣箱',
              handleClick: this.gotoNewTotes
            }
          : null
    }
  }

  render() {
    const products = this.props.products[this.pathname]
    const { showIntroduction, showSortBotton } = this.props
    return (
      <Products
        {...this.props}
        miniAppShareUrl={this.handleShareUrl ? this.handleShareUrl() : null}
        products={_.isEmpty(products) ? [] : products}
        showIntroduction={showIntroduction}
        showSortBotton={showSortBotton}
        toggleCloset={this.toggleCloset}
        fetchProducts={this.fetchMoreProducts}
        showFilterModal={this.showFilterModal}
        hideFilterModal={this.hideFilterModal}
        intelligentSelect={this.intelligentSelect}
        handleIKnow={this.handleIKnow}
        buttons={this.handleButtons()}
      />
    )
  }
}

export default ProductsContainer
