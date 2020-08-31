import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions.js'
import PropTypes from 'prop-types'
import BrowseCollection from './browse_collection'
import { browserHistory } from 'react-router'
import wxInit from 'src/app/lib/wx_config'
import deviceType from 'src/app/lib/device_type'
import authentication from 'src/app/lib/authentication'
import { shareReferralUrl } from 'src/app/lib/share_referral_url.js'
import initScrollTop from 'src/app/lib/init_scroll_to_top.js'
import { FETCH_PRODUCT_SORT_CONFIG_MAP } from '../../constants/fetchproductconfig'

class BrowseCollectionContainer extends React.Component {
  componentDidMount() {
    const { products } = this.props
    if (_.isEmpty(products)) {
      this.initialFetchProducts()
    } else {
      initScrollTop()
    }
  }

  initialFetchProducts = () => {
    const { dispatch, slug } = this.props
    dispatch(
      Actions.browseCollections.initialFetch(slug, () => {
        this.initWechatShare()
      })
    )
  }

  initWechatShare() {
    if (deviceType().isiOS) {
      wxInit()
    } else {
      wxInit(true, null, true)
    }
    //WECHATSHARE:COLLECTION微信分享
    wx.ready(() => {
      this.onMenuShareTimeline()
      this.onMenuShareAppMessage()
    })
  }

  fetchProducts = () => {
    const { collectionId, filters, loading, more, dispatch } = this.props
    if (loading || !more || _.isEmpty(filters)) {
      return null
    }
    dispatch(
      Actions.browseCollections.fetch(collectionId, {
        ...filters,
        page: filters.page
      })
    )
  }

  handleShareUrl = () => shareReferralUrl(this.props.customer)

  onMenuShareTimeline = () => {
    const { collection } = this.props
    wx.onMenuShareTimeline({
      title: (collection && collection.title) || `Le Tote 托特衣箱`,
      link: this.handleShareUrl(),
      imgUrl:
        (collection && collection.banner_photo_wide_banner_url) ||
        'https://qimg.letote.cn/logo/12logo400x400.png',
      fail: () => wxInit(true, this.onMenuShareTimeline),
      complete: this.handleAnalyze
    })
  }

  onMenuShareAppMessage = () => {
    const { collection } = this.props
    wx.onMenuShareAppMessage({
      title: (collection && collection.title) || `Le Tote 托特衣箱`,
      desc:
        (collection && collection.sub_title) ||
        '来自美国的时装共享平台，成为会员即刻随心穿搭，尽情尝试不同风格',
      link: this.handleShareUrl(),
      imgUrl:
        (collection && collection.banner_photo_wide_banner_url) ||
        'https://qimg.letote.cn/logo/12logo400x400.png',
      type: 'link',
      fail: () => wxInit(true, this.onMenuShareAppMessage),
      complete: this.handleAnalyze
    })
  }

  toggleCloset = (id, reportData) => {
    const inCloset = _.includes(this.props.closetProductIds, id)
    if (inCloset) {
      this.props.dispatch(Actions.closet.remove([id]))
    } else {
      this.props.dispatch(Actions.closet.add([id], reportData))
    }
  }

  toggleFilterModal = () => browserHistory.push('/filter_modal')

  setFilters = filters => {
    const { dispatch, collectionId } = this.props
    dispatch(Actions.browseCollections.setFilters(collectionId, filters))
  }

  clearProducts = () => {
    const { dispatch, collectionId } = this.props
    dispatch(Actions.browseCollections.clearProducts(collectionId))
  }

  applyFilters = () => {
    this.toggleFilterModal()
    this.clearProducts()
    this.fetchProducts()
  }

  render() {
    return (
      <BrowseCollection
        {...this.props}
        miniAppShareUrl={this.handleShareUrl ? this.handleShareUrl() : null}
        toggleCloset={this.toggleCloset}
        customerSignedIn={this.props.customerSignedIn}
        customerHasBestFitInfo={this.props.customer.has_best_fit_info}
        toggleFilterModal={this.toggleFilterModal}
        setFilters={this.setFilters}
        applyFilters={this.applyFilters}
        fetchProducts={this.fetchProducts}
      />
    )
  }
}

BrowseCollectionContainer.propTypes = {
  customer: PropTypes.object.isRequired,
  customerSignedIn: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  const slug = props.params.id
  const collectionId = state.browseCollections.slugsToIds[slug]

  let collection
  let products = []
  let more = true
  let filters = {}

  if (collectionId) {
    collection = state.browseCollections.collections[collectionId]
    products = collection.products
    more = collection.more
    filters = collection.filters
  }
  const productIds = state.closet.productIds
  const mini_share = {
    title: collection && collection.title,
    imgUrl: collection && collection.banner_photo_wide_banner_url,
    link: window.location.href
  }
  return {
    app: state.app,
    browseCollections: state.browseCollections,
    closetProductIds: productIds,
    collection,
    collectionId,
    customer: state.customer,
    authentication: authentication(state.customer),
    customerSignedIn: !!state.customer.id,
    filters: {
      ...filters,
      sort: FETCH_PRODUCT_SORT_CONFIG_MAP.collection
    },
    loading: state.browseCollections.loading,
    more,
    products,
    slug,
    mini_share
  }
}

export default connect(mapStateToProps)(withRouter(BrowseCollectionContainer))
