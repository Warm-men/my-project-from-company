import React from 'react'
import CustomerPhotos from './customer_photos'
import Actions from 'src/app/actions/actions.js'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import GeneralWxShareHOC from 'src/app/components/HOC/GeneralWxShare'
import wxInit from 'src/app/lib/wx_config'
import deviceType from 'src/app/lib/device_type'
class CustomerPhotosContainer extends React.Component {
  constructor() {
    super()
    this.handleClick = /MicroMessenger/i.test(navigator.userAgent)
      ? this.handleWeChatClick
      : this.handleWebClick
  }

  componentDidMount() {
    if (sessionStorage.getItem('refreshCustomerPhotos')) {
      this.initFetchCustomerPhotos()
      sessionStorage.removeItem('refreshCustomerPhotos')
    }
    if (deviceType().isiOS) {
      wxInit()
    } else {
      wxInit(true, null, true)
      const scrollTop = sessionStorage.getItem(window.location.pathname)
      if (scrollTop) {
        document.documentElement.scrollTop = scrollTop
      }
    }
  }

  handleWeChatClick = product => {
    const img = product.url || product.mobile_url
    const NewArr = [img]
    wx.previewImage({
      urls: NewArr, // 需要预览的图片http链接列表
      fail: () => wxInit(true, () => this.handleWeChatClick(product))
    })
  }

  handleWebClick = product => {
    this.props.dispatch(
      Actions.fullscreencarousel.setFullScreenPhoto([product])
    )
    browserHistory.push('/fullscreen')
  }

  initFetchCustomerPhotos = async () => {
    await this.clearCustomerPhotos()
    this.fetchCustomerPhotos()
  }

  fetchCustomerPhotos = () => {
    this.props.dispatch(Actions.customerPhotos.fetchCustomerPhotos())
  }

  clearCustomerPhotos = () => {
    this.props.dispatch(Actions.customerPhotos.clearCustomerPhotos())
  }

  render() {
    return (
      <CustomerPhotos
        {...this.props}
        handlePhotoClick={this.handleClick}
        onScrollToBottom={this.fetchCustomerPhotos}
      />
    )
  }
}

function mapStateToProps(state) {
  const { customerPhotos } = state
  return {
    ...customerPhotos
  }
}
export default connect(mapStateToProps)(
  GeneralWxShareHOC(CustomerPhotosContainer)
)
