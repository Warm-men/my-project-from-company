import Actions from 'src/app/actions/actions.js'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import ProductContainer from './products_container'
import wxInit from 'src/app/lib/wx_config'
import deviceType from 'src/app/lib/device_type'
import authentication from 'src/app/lib/authentication'
import { shareReferralUrl } from 'src/app/lib/share_referral_url.js'
import { FETCH_PRODUCT_SORT_CONFIG_MAP } from '../../constants/fetchproductconfig'
import {
  APPStatisticManager,
  BaiduStatisService
} from '../../lib/statistics/app'

const enhance = compose(connect(mapStateToProps))

@enhance
export default class ProductsByBrandIdContainer extends ProductContainer {
  initWechatShare = () => {
    if (deviceType().isiOS) {
      wxInit()
    } else {
      wxInit(true, null, true)
    }
    const share_params = this.props.share_params
    //WECHATSHARE: 品牌页微信分享
    wx.ready(() => {
      this.onMenuShareTimeline(share_params)
      this.onMenuShareAppMessage(share_params)
    })
  }

  handleAnalyze = () => {
    const { analyzeAction, analyzeLabel } = this.props
    if (_.isEmpty(analyzeAction) || _.isEmpty(analyzeLabel)) {
      return null
    }
    APPStatisticManager.service(BaiduStatisService.id).track(
      'share',
      analyzeLabel,
      analyzeAction
    )
  }

  componentWillReceiveProps(nextProps) {
    const initAfterPropsChange = _.once(this.initWechatShare)
    if (nextProps.productsTitle !== '品牌专题') {
      initAfterPropsChange()
    }
  }

  handleShareUrl = () => shareReferralUrl(this.props.customer)

  onMenuShareTimeline = share_params => {
    wx.onMenuShareTimeline({
      title: (share_params && share_params.title) || `Le Tote 托特衣箱`,
      link: this.handleShareUrl(),
      imgUrl:
        (share_params && share_params.imgUrl) ||
        'https://qimg.letote.cn/logo/12logo400x400.png',
      fail: () => wxInit(true, this.onMenuShareTimeline),
      complete: this.handleAnalyze
    })
  }

  onMenuShareAppMessage = share_params => {
    wx.onMenuShareAppMessage({
      title: (share_params && share_params.title) || `Le Tote 托特衣箱`,
      desc: '来自美国的时装共享平台，成为会员即刻随心穿搭，尽情尝试不同风格',
      link: this.handleShareUrl(),
      imgUrl:
        (share_params && share_params.imgUrl) ||
        'https://qimg.letote.cn/logo/12logo400x400.png',
      type: 'link',
      fail: () => wxInit(true, this.onMenuShareAppMessage),
      complete: this.handleAnalyze
    })
  }

  fetchProducts = () => {
    const { filters, filters_occasion, the_second_level, params } = this.props
    const actions = Actions.allproducts.fetchBrandProducts(
      params.id,
      filters,
      filters_occasion,
      the_second_level
    )
    this.props.dispatch(actions)
  }
}

function mapStateToProps(state, props) {
  const { allproducts, customer, closet } = state
  const title = allproducts.name ? allproducts.name : '品牌专题'
  const share_params = {
    title: `${title} 托特衣箱精选品牌`,
    link: `https://${window.location.host}/brands/${props.params.id}`,
    imgUrl: allproducts.image_url
  }
  const mini_share = {
    title: `这个品牌我很喜欢，你呢？`,
    imgUrl: allproducts.image_url,
    link: window.location.href
  }
  return {
    ...allproducts,
    filters: {
      ...allproducts.filters,
      sort: FETCH_PRODUCT_SORT_CONFIG_MAP.brand
    },
    productsTitle: title,
    showIntroduction: true,
    fetchMoreProducts: true,
    showSortBotton: true,
    closetProductIds: closet.productIds,
    customer,
    mini_share,
    customerSignedIn: !!customer.id,
    cart: state.cart,
    isShowStock: true,
    share_params,
    analyzeAction: 'share_brand',
    analyzeLabel: { brandId: props.params.id },
    logo: allproducts.image_url,
    scrollName: 'brandProducts',
    authentication: authentication(customer)
  }
}
