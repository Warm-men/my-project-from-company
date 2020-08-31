import Actions from 'src/app/actions/actions.js'
import { connect } from 'react-redux'
import { compose, branch, renderNothing, lifecycle } from 'recompose'
import ProductsContainer from './products_container'
import Products from './products'
import { format, addDays } from 'date-fns'
import wxInit from 'src/app/lib/wx_config'
import deviceType from 'src/app/lib/device_type'
import * as storage from 'src/app/lib/storage.js'
import authentication from 'src/app/lib/authentication'
import { FETCH_PRODUCT_SORT_CONFIG_MAP } from '../../constants/fetchproductconfig'
import {
  APPStatisticManager,
  BaiduStatisService
} from '../../lib/statistics/app'

const enhance = compose(
  connect(mapStateToProps),
  lifecycle({
    componentWillMount() {
      if (storage.get('new_product_scroll_top')) {
        setTimeout(() => window.scrollTo(0, 0), 0)
        storage.remove('new_product_scroll_top')
      }
      if (_.isEmpty(this.props.newArrival)) {
        this.props.dispatch(Actions.homepage.fetchHomepageNewArrival())
      }
    }
  }),
  branch(props => !props.latest_call_to_actions, renderNothing)
)

@enhance
export default class ProductsNewContainer extends ProductsContainer {
  constructor(props) {
    super()
    this.pathname = window.location.pathname
    this.initFilter = null
    this.isOnboardingSwap =
      !props.authentication.isSubscriber &&
      props.customer.finished_onboarding_questions === 'ALL'
  }

  handleSelectSortBtn = data => async () => {
    const { filters } = this.props
    let intervals = filters.activated_date_intervals || []
    if (
      !_.isEmpty(intervals) &&
      _.find(intervals, v => v.since === data.value)
    ) {
      _.remove(intervals, v => v.since === data.value)
    } else {
      intervals.push({
        since: data.value,
        before: format(addDays(data.value, 1), 'YYYY-MM-DD')
      })
    }
    const newFilters = {
      ...filters,
      page: 1,
      activated_date_intervals: intervals
    }
    await this.props.dispatch(Actions.allproducts.clearProducts(this.pathname))
    await this.props.dispatch(Actions.allproducts.resetFilters())
    await this.props.dispatch(Actions.allproducts.setFilters(newFilters, false))
    this.fetchProducts()
  }

  initialProducts = async () => {
    await this.props.dispatch(Actions.allproducts.clearProducts(this.pathname))
    await this.props.dispatch(Actions.allproducts.resetFilters())
    const { latest_call_to_actions, filters } = this.props
    let intervals = []
    _.map(latest_call_to_actions, v1 => {
      intervals.push({
        since: v1,
        before: format(addDays(v1, 1), 'YYYY-MM-DD')
      })
    })
    const newFilters = {
      ...filters,
      activated_date_intervals: intervals
    }
    this.fetchProducts(newFilters)
  }

  fetchProducts = filters => {
    const { dispatch, latest_call_to_actions } = this.props
    let newFilters = filters || this.props.filters
    // NOTE：当用户没有选择任何时间段时，为全部
    if (_.isEmpty(newFilters.activated_date_intervals)) {
      let intervals = []
      _.map(latest_call_to_actions, v1 => {
        intervals.push({
          since: v1,
          before: format(addDays(v1, 1), 'YYYY-MM-DD')
        })
      })
      newFilters = {
        ...newFilters,
        activated_date_intervals: intervals
      }
    }
    dispatch(Actions.allproducts.fetchNewProducts(newFilters))
  }

  initWechatShare() {
    if (deviceType().isiOS) {
      wxInit()
    } else {
      wxInit(true, null, true)
    }
    //WECHATSHARE: 上新页微信分享
    wx.ready(() => {
      this.onMenuShareTimeline()
      this.onMenuShareAppMessage()
    })
  }

  handleAnalyze = () => {
    APPStatisticManager.service(BaiduStatisService.id).track(
      'share',
      { bannerId: this.props.id },
      'share_new_arrival'
    )
  }

  handleShareUrl = () => `https://${window.location.host}`

  onMenuShareTimeline = () => {
    wx.onMenuShareTimeline({
      title: 'Le Tote 托特衣箱',
      link: this.handleShareUrl(),
      imgUrl: 'https://qimg.letote.cn/logo/12logo400x400.png',
      fail: () => wxInit(true, this.onMenuShareTimeline),
      complete: this.handleAnalyze
    })
  }

  onMenuShareAppMessage = () => {
    wx.onMenuShareAppMessage({
      title: 'Le Tote 托特衣箱',
      desc: '来自美国的时装共享平台，成为会员即刻随心穿搭，尽情尝试不同风格',
      link: this.handleShareUrl(),
      imgUrl: 'https://qimg.letote.cn/logo/12logo400x400.png',
      type: 'link',
      fail: () => wxInit(true, this.onMenuShareAppMessage),
      complete: this.handleAnalyze
    })
  }

  fetchMoreProducts = () => {
    const scrollPosition =
      document.body.scrollTop || document.documentElement.scrollTop
    if (
      this.props.loading ||
      !this.props.fetchMoreProducts ||
      scrollPosition === 0
    ) {
      return
    }
    const filters = { ...this.props.filters }
    const newFilters = {
      page: filters.page + 1
    }
    this.setFilters(newFilters)
    this.fetchProducts()
  }

  render() {
    const products = this.props.products[this.pathname]
    const isEmpty = _.isEmpty(products)
    return (
      <Products
        {...this.props}
        products={isEmpty ? [] : products}
        miniAppShareUrl={this.handleShareUrl ? this.handleShareUrl() : null}
        showIntroduction={this.props.showIntroduction}
        showSortBotton={this.props.showSortBotton}
        toggleCloset={this.toggleCloset}
        fetchProducts={this.fetchMoreProducts}
        hideFilterModal={this.hideFilterModal}
        showFilterModal={this.showFilterModal}
        setFilters={this.setFilters}
        applyFilters={this.applyFilters}
        handleSelectSortBtn={this.handleSelectSortBtn}
        isShowSeasonSample={true}
      />
    )
  }
}

function mapStateToProps(state) {
  const { allproducts, customer, closet, homepage } = state
  const newestData = homepage.newArrival[0]
  const logo = newestData ? newestData.inner_logo || newestData.logo : ''
  return {
    ...allproducts,
    ...newestData,
    newArrival: homepage.newArrival,
    filters: {
      ...allproducts.filters,
      sort: FETCH_PRODUCT_SORT_CONFIG_MAP.recentNew
    },
    productsTitle: '近期上架',
    fetchMoreProducts: true,
    showSortBotton: false,
    showIntroduction: false,
    showNewProductsSortBtn: true,
    closetProductIds: closet.productIds,
    customer,
    customerSignedIn: !!customer.id,
    cart: state.cart,
    isShowStock: true,
    isNoSort: true,
    logo,
    scrollName: 'newProducts',
    authentication: authentication(customer)
  }
}
