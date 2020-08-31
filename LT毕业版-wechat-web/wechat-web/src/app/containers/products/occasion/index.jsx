import ProductsContainer from '../products_container'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions.js'
import * as storage from 'src/app/lib/storage.js'
import wxInit from 'src/app/lib/wx_config'
import deviceType from 'src/app/lib/device_type'
import authentication from 'src/app/lib/authentication'
import { shareReferralUrl } from 'src/app/lib/share_referral_url.js'
import { mapFilters } from 'src/app/lib/filters.js'
import { FETCH_PRODUCT_SORT_CONFIG_MAP } from '../../../constants/fetchproductconfig'

const getState = (state, props) => {
  const { allproducts, customer, homepage, closet } = state
  const { occasion } = homepage
  const { slug } = props.params

  let currentOccasion
  occasion.forEach(item => {
    if (item.link && item.link.indexOf(slug) !== -1) {
      currentOccasion = item
    }
  })
  const mini_share = {
    title: `这个风格很适合你哦，快来看看！`,
    link: window.location.href
  }

  return {
    ...allproducts,
    filters: {
      ...allproducts.filters,
      sort: FETCH_PRODUCT_SORT_CONFIG_MAP.occasion
    },
    customer,
    occasion,
    mini_share,
    customerSignedIn: !!customer.id,
    productsTitle: currentOccasion && currentOccasion.title,
    showIntroduction: true,
    fetchMoreProducts: true,
    showSortBotton: true,
    isShowStock: true,
    authentication: authentication(customer),
    isOccasion: true,
    closetProductIds: closet.productIds
  }
}

function recomposeHOC(Component) {
  return function(props) {
    useEffect(() => {
      if (storage.get('occasion_scroll_top')) {
        window.scrollTo(0, 0)
        storage.remove('occasion_scroll_top')
      }
    }, [])
    return _.isEmpty(props.occasion) ? null : <Component {...props} />
  }
}

class Occasion extends ProductsContainer {
  initWechatShare() {
    if (deviceType().isiOS) {
      wxInit()
    } else {
      wxInit(true, null, true)
    }
    //WECHATSHARE: Occasion微信分享
    wx.ready(() => {
      this.onMenuShareTimeline()
      this.onMenuShareAppMessage()
    })
  }

  handleShareUrl = () => shareReferralUrl(this.props.customer)

  getTitle = () => {
    const { occasion, location } = this.props
    const data = occasion.find(e => e.link === location.pathname)
    return data ? data.title : ''
  }

  onMenuShareTimeline = () => {
    wx.onMenuShareTimeline({
      title: `${this.getTitle()} 这种风格很适合你`,
      link: this.handleShareUrl(),
      imgUrl: 'https://qimg.letote.cn/logo/12logo400x400.png',
      fail: () => wxInit(true, this.onMenuShareTimeline)
    })
  }

  onMenuShareAppMessage = () => {
    wx.onMenuShareAppMessage({
      title: `${this.getTitle()} 这种风格很适合你`,
      desc: '来自美国的时装共享平台，成为会员即刻随心穿搭，尽情尝试不同风格',
      link: this.handleShareUrl(),
      imgUrl: 'https://qimg.letote.cn/logo/12logo400x400.png',
      type: 'link',
      fail: () => wxInit(true, this.onMenuShareAppMessage)
    })
  }

  fetchProducts = () => {
    const {
      filters,
      params: { slug },
      the_second_level,
      filters_occasion
    } = this.props
    const input = {
      filters: {
        ...filters,
        filter_terms: 'clothing'
      },
      search_context: {
        product_search_sections: [
          {
            product_search_slots: [{ id: Number(slug), selected: true }]
          }
        ]
      }
    }
    const mapFilter = mapFilters(filters, the_second_level, filters_occasion)
    if (
      !_.isEmpty(mapFilter.search_context) &&
      !_.isEmpty(mapFilter.search_context.product_search_sections)
    ) {
      _.map(mapFilter.search_context.product_search_sections, item => {
        input.search_context.product_search_sections.push(item)
      })
    }
    this.props.dispatch(Actions.allproducts.fetchOccasionProducts(input))
  }
}

export default connect(getState)(recomposeHOC(Occasion))
