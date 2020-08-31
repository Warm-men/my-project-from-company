import { withRouter } from 'react-router'
import { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions.js'
import ProductWrapper from './product'
import authentication from 'src/app/lib/authentication'
import * as storage from 'src/app/lib/storage.js'
import PageHelmet from 'src/app/lib/pagehelmet'
import scrollTopAnimation from 'src/app/lib/request_animation_frame.js'
import './index.scss'
import {
  APPStatisticManager,
  BaiduStatisService
} from '../../lib/statistics/app'

function mapStateToProps(state, props) {
  const { params, location } = props
  const productId = Number(params.product_id)
  const { closet, allproducts, customer, products, tote_cart, totes } = state
  const productIds = closet.productIds
  const product =
    products.products[productId] ||
    (location.state ? location.state.product : {})
  return {
    app: state.app,
    allproducts,
    style: customer.style,
    customer,
    authentication: authentication(customer),
    productId,
    product,
    similar_products: product ? product.similar_products : [],
    closetProductIds: productIds,
    inCloset: _.includes(productIds, productId),
    tote_cart,
    totes
  }
}

export default connect(mapStateToProps)(withRouter(ProductContainer))

function ProductContainer(props) {
  const { dispatch, router, app, customer, location, productId } = props

  const imgHeight = useRef()
  const [isShowBackToTop, setIsShowBackToTop] = useState(false)
  const [realtimeProductRecommended, setRealtimeProductRecommended] = useState(
    null
  )

  useEffect(() => {
    fetchProduct(productId)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [productId])

  const updateProductPhotoHeight = height => (imgHeight.current = height || 0)

  const handleScroll = _.debounce(
    () => {
      let scrollPosition =
        document.body.scrollTop || document.documentElement.scrollTop
      if (scrollPosition >= imgHeight.current) {
        setIsShowBackToTop(true)
      } else {
        setIsShowBackToTop(false)
      }
    },
    50,
    {
      leading: true
    }
  )

  const gotoBrandProducts = () => {
    const { brand } = props.product
    router.push({
      pathname: `/brands/${Number(brand.id)}`,
      query: { ...location.query, timestamp: Date.now() }
    })
  }

  const fetchProduct = productId => {
    const id = productId || props.productId
    dispatch(Actions.products.fetchBrowseProduct(id, fetchProductSuccess))
    dispatch(
      Actions.products.fetchRealtimeRecommended(id, (_, response) => {
        setRealtimeProductRecommended(
          response.data.realtime_product_recommended_size_and_product_sizes
        )
      })
    )
  }

  const fetchProductSuccess = (dispatch, { data }) => {
    const { catalogue_photos, recommended_size, product_sizes } = data.product
    dispatch(Actions.fullscreencarousel.setFullScreenPhoto(catalogue_photos))
    //NOTE: baidu htm
    if (props.authentication.isValidSubscriber) {
      const opt_label = {
          customerId: customer.id,
          productId,
          size: recommended_size
        },
        recommandProduct = _.find(product_sizes, ps => ps.recommended),
        action = recommandProduct && recommandProduct.swappable ? 'in' : 'out'
      APPStatisticManager.service(BaiduStatisService.id).track(
        'stock',
        opt_label,
        action
      )
    }
    dispatch(Actions.products.fetctSimilarProducts(productId, 10))
  }

  const toggleCloset = (id, reportData) => {
    const inCloset = _.includes(props.closetProductIds, id)
    if (inCloset) {
      dispatch(Actions.closet.remove([id]))
    } else {
      dispatch(Actions.closet.add([id], reportData))
    }
  }

  const linkToSelectSize = () => {
    storage.remove('displayedTips')
    storage.set('isReceivedRule', true)
    router.push({
      pathname: '/style_profile/figure_input',
      query: { pre_page: 'product_detail' }
    })
  }

  const linkToPlans = () => {
    const opt_label = {
        source: 'apps_guide',
        medium: 'prod_detail',
        campaign: ''
      },
      { jd_credit_score } = props.customer,
      { source } = location.query
    // NOTE: ABTEST
    if (source === 'hotitem') {
      window.adhoc('track', 'enterPlans', 1)
    }
    window.adhoc('track', 'enterPlans_v2', 1)
    if (
      app.platform === 'jd' &&
      jd_credit_score &&
      Number(jd_credit_score.score) < 70
    ) {
      dispatch(
        Actions.app.showGlobalAlert({
          content: '你的小白信用低于70分，暂时还不能享受免押金权益',
          handleClick: () => dispatch(Actions.app.resetGlobalAlert()),
          btnText: '好的'
        })
      )
      return null
    }
    APPStatisticManager.service(BaiduStatisService.id).track(
      'apps_guide',
      opt_label,
      'prod_detail'
    )
    router.push('/plans')
  }

  const mini_share = () => {
    const { product } = props
    return {
      shareTitle:
        product && product.type === 'Clothing'
          ? '这件衣服你穿肯定超好看！快来看看！'
          : '这款太适合你了！快来看看！',
      shareImg:
        !_.isEmpty(product) && !_.isEmpty(product.catalogue_photos)
          ? product.catalogue_photos[0].giant_url
          : location.state
          ? location.state.img_url
          : null,
      shareUrl: window.location.href
    }
  }

  const miniShare = mini_share()

  const {
    location: { pathname, state }
  } = props
  const reportData = {
    router: pathname,
    page_type: 'detail',
    filter_and_sort: productId,
    column_name: state && state.column_name
  }

  return (
    <div className="container-wrapper">
      <PageHelmet
        title="详情"
        link={`/products/${productId}`}
        isNotPostMsg={true}
        {...miniShare}
      />
      <ProductWrapper
        {...props}
        reportData={reportData}
        miniShare={miniShare}
        toggleCloset={toggleCloset}
        goBack={router.goBack}
        gotoBrandProducts={gotoBrandProducts}
        linkToSelectSize={linkToSelectSize}
        linkToPlans={linkToPlans}
        isVacation={storage.get('vacation_plans')}
        updateProductPhotoHeight={updateProductPhotoHeight}
        realtimeProductRecommended={realtimeProductRecommended}
      />
      {isShowBackToTop && (
        <div onClick={scrollTopAnimation(6)} className="back-to-top" />
      )}
    </div>
  )
}
