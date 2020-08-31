import { useEffect, useRef } from 'react'
import Actions from 'src/app/actions/actions.js'
import { connect } from 'react-redux'
import wxInit from 'src/app/lib/wx_config'
import deviceType from 'src/app/lib/device_type'
import CustomerPhotoDetailsItem from 'src/app/components/customer_photos/customer_photos_details/item'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import { shareReferralUrl } from 'src/app/lib/share_referral_url.js'
import { UTM_CUSTOMER_PHOTO } from '../../constants/global_config'

function mapStateToProps(state, props) {
  const { closet, customerPhotosDetails, app, customer } = state
  return {
    location: props.location,
    closetProductIds: closet.productIds,
    customerPhotosDetails,
    app,
    customer
  }
}

const CustomerPhotosFinish = props => {
  const { dispatch, app } = props
  const customer_photo_id = props.location.query.customer_photo_id
  const isOwnShare = useRef(null)

  useEffect(() => {
    const { customer_photos_details } = props.customerPhotosDetails
    if (_.isEmpty(customer_photos_details)) {
      getTheCustomerPhoto()
    }
    initWechatShare()
  }, [])

  const setShareState = (customer, data) => {
    const currentCustomerID = _.get(customer, 'id')
    const photoCustomerID = _.get(
      data,
      'data.customer_photo_summary.customer_photos[0].customer.id'
    )
    if (
      currentCustomerID &&
      photoCustomerID &&
      currentCustomerID === _.toString(photoCustomerID)
    ) {
      isOwnShare.current = true
      initWechatShare()
    }
  }

  const initWechatShare = () => {
    if (deviceType().isiOS) {
      wxInit()
    } else {
      wxInit(true, null, true)
    }
    if (props.app.platform === 'mini_app') {
      postMiniApp()
    }
    //WECHATSHARE: 用户晒单微信分享
    wx.ready(() => {
      onMenuShareTimeline()
      onMenuShareAppMessage()
    })
  }

  const postMiniApp = () => {
    // NOTE:小程序环境postMessage处理ios分享
    if (props.app.platform === 'mini_app') {
      // NOTE：因helmet影响，title不是进入界面就是正确的title，需要在页面更换标题后进行postMessage处理
      const data = {
        url: handleShareUrl() || window.location.href,
        title: isOwnShare.current
          ? '我在托特衣箱上发了一篇晒单，快来帮我点赞吧! '
          : '这篇晒单很好看，快来点赞吧！'
      }
      wx.miniProgram.postMessage({ data })
    }
  }

  const handleShareUrl = () => {
    const url = `https://${window.location.host}/customer_photo_details?customer_photo_id=${customer_photo_id}`
    return shareReferralUrl(props.customer, url, UTM_CUSTOMER_PHOTO)
  }

  const onMenuShareTimeline = () => {
    wx.onMenuShareTimeline({
      title: isOwnShare.current
        ? '我在托特衣箱上发了一篇晒单，快来帮我点赞吧! '
        : '这篇晒单很好看，快来点赞吧！',
      link: handleShareUrl(),
      imgUrl: 'https://qimg.letote.cn/logo/12logo400x400.png', // 分享图标
      fail: () => wxInit(true, onMenuShareTimeline)
    })
  }

  const onMenuShareAppMessage = () => {
    wx.onMenuShareAppMessage({
      title: isOwnShare.current
        ? '我在托特衣箱上发了一篇晒单，快来帮我点赞吧! '
        : '这篇晒单很好看，快来点赞吧！', // 分享标题
      desc: '高品质品牌服饰随心换穿你也可以！', // 分享描述
      link: handleShareUrl(),
      imgUrl: 'https://qimg.letote.cn/logo/12logo400x400.png', // 分享图标
      type: 'link', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      fail: () => wxInit(true, onMenuShareAppMessage)
    })
  }

  const getTheCustomerPhoto = () => {
    const variables = { customer_photo_id }
    dispatch(
      Actions.customerPhotosSummary.fetchCustomerPhotosDetailsFirst(
        variables,
        (dispatch, data) => {
          setShareState(props.customer, data)
        }
      )
    )
  }

  const toggleCloset = (id, variables) => {
    const inCloset = _.includes(props.closetProductIds, id)
    const reportData = {
      router: props.location.pathname,
      column_name: 'CustomerPhotosDetailsList',
      page_type: 'list',
      index: variables.index
    }
    if (inCloset) {
      dispatch(Actions.closet.remove([id]))
    } else {
      window.adhoc('track', 'add_closet_v2', 1)
      dispatch(Actions.closet.add([id], reportData))
    }
  }

  const didSelectedItem = product => {
    browserHistory.push({
      pathname: `/products/${product.id}`,
      query: { customer_photo_id },
      state: {
        img_url: product.catalogue_photos[0].full_url,
        column_name: 'CustomerPhotoDetails',
        product
      }
    })
  }

  const {
    customerPhotosDetails: { customer_photos_details }
  } = props
  if (_.isEmpty(customer_photos_details)) {
    return null
  }
  return (
    <div className="customer-photo-details-contents">
      <PageHelmet title="晒单详情" link="/customer_photos" isNotPostMsg />
      <div className="item-view-wrapper">
        <CustomerPhotoDetailsItem
          customerPhotoDetailItem={customer_photos_details[0]}
          dispatch={dispatch}
          app={app}
          toggleCloset={toggleCloset}
          didSelectedItem={didSelectedItem}
          currentCustomer={props.customer}
        />
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(CustomerPhotosFinish)
