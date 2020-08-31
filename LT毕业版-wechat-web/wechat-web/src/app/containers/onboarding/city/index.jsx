import React, { Component } from 'react'
import CityPicker from 'src/app/components/CityPicker'
import wxInit from 'src/app/lib/wx_config.js'
import fetchJsonp from 'src/app/lib/jsonp.js'
import './index.scss'
import PROVINS from 'src/app/components/CityPicker/utils/provins.json'
import CITYS from 'src/app/components/CityPicker/utils/citys.json'
import Actions from 'src/app/actions/actions'
import ActionButtons from 'src/app/containers/onboarding/utils_component/action_buttons'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import DataTitle from 'src/app/containers/onboarding/utils_component/data_title'
import PageHelmet from 'src/app/lib/pagehelmet'

class City extends Component {
  constructor(props) {
    super(props)
    const { shipping_address, onboarding, location } = props
    this.provin_index = 0
    this.city_index = 0
    this.state = {
      defaultValue: this.props.defaultValue,
      isShow: false,
      province: shipping_address ? shipping_address.state : '',
      city: shipping_address ? shipping_address.city : '',
      hasLocationInfo: false,
      isSubmit: false
    }
    this.index = _.findIndex(
      onboarding.routerList,
      path => location.pathname === `/get-started/${path}`
    )
  }

  componentDidMount() {
    if (this.props.isWechat) {
      wxInit()
      setTimeout(() => {
        this.getLocation()
      }, 200)
    }
  }

  isValidCityInfo = () => Boolean(this.state.province && this.state.city)

  // num传入的数字，n需要的字符长度 不满补零
  prefixInteger = (num, n) => (Array(n).join(0) + num).slice(-n)

  handleCityConfirm = ({ province, city, provin_index, city_index }) => {
    this.provin_index = this.prefixInteger(provin_index, 2)
    this.city_index = this.prefixInteger(city_index, 4)
    this.setLocation(province, city)
  }

  getLocation = () =>
    wx.ready(() => {
      wx.getLocation({
        type: 'wgs84',
        success: res => {
          // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          const latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
          const longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
          this.getLoacitionInfo(latitude, longitude, this)
        },
        fail: () => {
          wxInit(true, this.getLocation)
        }
      })
    })

  getLoacitionInfo = (latitude, longitude) =>
    fetchJsonp(
      `https://api.map.baidu.com/geocoder/v2/?location=${latitude},${longitude}&output=json&pois=1&ak=9zXSsBhLWYFnepADRGCaGfwtAKDUYUXf`
    )
      .then(response => response.json())
      .then(json => {
        const addressComponent = json.result.addressComponent
        const province = addressComponent.province,
          city = addressComponent.city
        const isSupportThisProvince = PROVINS.indexOf(province) !== -1,
          isSupportThisCity =
            isSupportThisProvince && CITYS[province].indexOf(city) !== -1
        if (isSupportThisProvince && isSupportThisCity) {
          this.setState({
            defaultValue: [province, city],
            province: province,
            city: city
          })
          this.setLocation(province, city)
        }
      })
      .catch(error =>
        //TODO: 将来报到百度统计
        console.error(error)
      )

  onConfirm = (value, provin_index, city_index) => {
    this.setState({
      province: value[0],
      city: value[1],
      isShow: false
    })
    this.handleCityConfirm({
      province: value[0],
      city: value[1],
      provin_index: provin_index,
      city_index: city_index
    })
  }
  onCancel = () =>
    this.setState({
      isShow: false
    })
  onChange = value =>
    this.setState({
      province: value[0],
      city: value[1]
    })
  handleSelectCity = () => this.setState({ isShow: true })

  setLocation = (province, city) => {
    const isUnValidCity = !this.isValidCityInfo()
    if (isUnValidCity) {
      this.setState({
        province: province,
        city: city
      })
    }
  }

  onSubmit = () => {
    this.setState(
      {
        isSubmit: true
      },
      () => {
        const { province, city } = this.state
        this.props.dispatch(
          Actions.updateShippingAddress({
            shipping_address: {
              address_1: '',
              address_2: '',
              city: city,
              state: province,
              zip_code: `99${this.provin_index}${this.city_index}`,
              telephone: '',
              full_name: '',
              country: 'CN'
            },
            success: this.updateShippingAddressSuc
          })
        )
      }
    )
  }

  updateShippingAddressSuc = () => {
    const { style, dispatch } = this.props
    if (style && style.top_size && style.dress_size) {
      dispatch(
        Actions.activeQueueProduct.activeQueueProduct({
          success: () => {}
        })
      )
    }
    const { routerList } = this.props.onboarding
    browserHistory.push(`/get-started/${routerList[this.index + 1]}`)
  }

  render() {
    const { province, city, defaultValue, isSubmit } = this.state
    const { routerList } = this.props.onboarding
    const pageNum = `${this.index + 1}/${routerList.length}`
    return (
      <div className="city-picker container-box">
        <PageHelmet
          title={`定制衣箱-${pageNum}`}
          link={this.props.location.pathname}
        />
        <DataTitle
          title="舒适"
          tips={pageNum}
          text="根据未来7天的气温为你准备衣箱"
        />
        <span className="live-city">所在城市</span>
        <div className="detail">选择城市能让我们推荐给你的衣服更加准确</div>
        <div className="city-info mid" onClick={this.handleSelectCity}>
          {province ? `${province}` : '请选择...'}&nbsp; &nbsp;
          {city ? city : null}
          <span />
        </div>
        {/* <p className="onboarding-tips-text fix-position">定位城市</p> */}
        <CityPicker
          defaultValue={defaultValue}
          province={province}
          city={city}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
          onChange={this.onChange}
          visible={this.state.isShow}
        />
        <ActionButtons
          rightDisabled={!this.isValidCityInfo()}
          isSubmiting={isSubmit}
          nextStep={this.onSubmit}
        />
      </div>
    )
  }
}

City.defaultProps = {
  defaultValue: ['广东省', '深圳市'],
  province: null,
  city: null
}

function mapStateToProps(state) {
  const { customer, app } = state
  return {
    onboarding: state.onboarding || {},
    shipping_address: customer.shipping_address,
    style: customer.style,
    isWechat: app.isWechat
  }
}

export default connect(mapStateToProps)(City)
