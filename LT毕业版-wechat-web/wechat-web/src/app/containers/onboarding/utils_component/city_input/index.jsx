import React, { Component } from 'react'
import CityPicker from 'src/app/components/CityPicker'
import wxInit from 'src/app/lib/wx_config'
import fetchJsonp from 'src/app/lib/jsonp'
import './index.scss'
import PROVINS from 'src/app/components/CityPicker/utils/provins.json'
import CITYS from 'src/app/components/CityPicker/utils/citys.json'

class CityInput extends Component {
  constructor(props) {
    super(props)
    const { province, city } = props

    this.defaultValue =
      province && city ? [province, city] : ['广东省', '深圳市']

    this.state = { isShow: false }

    this.provin_index = 0
    this.city_index = 0
  }

  componentDidMount() {
    if (this.props.isWechat) {
      wxInit()
      setTimeout(() => {
        const { province, city } = this.props
        if (!province || !city) {
          this.getLocation()
        }
      }, 200)
    }
  }

  handleSelectCity = () => this.setState({ isShow: true })

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

  getLoacitionInfo = (latitude, longitude) => {
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
          const { updateStateAndCity } = this.props
          const zip_code = this.getCurrentAddressZipCode()
          updateStateAndCity(province, city, zip_code)
        }
      })
      .catch(() => {})
  }

  onCancel = () => this.setState({ isShow: false })

  onConfirm = (value, provin_index, city_index) => {
    const { updateStateAndCity } = this.props
    const province = value[0]
    const city = value[1]

    this.provin_index = this.prefixInteger(provin_index, 2)
    this.city_index = this.prefixInteger(city_index, 4)

    const zip_code = this.getCurrentAddressZipCode()

    updateStateAndCity(province, city, zip_code)

    this.setState({ isShow: false })
  }
  // num传入的数字，n需要的字符长度 不满补零
  prefixInteger = (num, n) => (Array(n).join(0) + num).slice(-n)

  getCurrentAddressZipCode = () => {
    return `99${this.provin_index}${this.city_index}`
  }

  render() {
    const { province, city } = this.props
    return (
      <div className="city-input">
        <span className="city-title">生活城市</span>
        <div className="input-box" onClick={this.handleSelectCity}>
          {province ? (
            <span className="input-value">
              {province} {city}
            </span>
          ) : (
            <span className="input-placeholder">请选择你生活的城市</span>
          )}
        </div>
        <CityPicker
          visible={this.state.isShow}
          defaultValue={this.defaultValue}
          province={province}
          city={city}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
        />
      </div>
    )
  }
}

CityInput.defaultProps = {
  province: null,
  city: null
}

export default CityInput
