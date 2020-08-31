import React, { Component } from 'react'
import './index.scss'
import wxInit from 'src/app/lib/wx_config.js'
import PropTypes from 'prop-types'
import { isValidChineseName } from 'src/app/lib/validators.js'
import { browserHistory } from 'react-router'
import { parseHashString } from 'src/app/lib/parseHashString.js'
import { navigateToAddress } from 'src/app/containers/plans/mini_program/index.js'
import delay from 'src/app/lib/delay.js'

export default class WxAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSuccess: false,
      full_name: props.customer_shipping_address.full_name, // 收货人姓名
      zip_code: props.customer_shipping_address.zip_code, // 邮编
      state: props.customer_shipping_address.state, // 国标收货地址第一级地址（省）
      city: props.customer_shipping_address.city, // 国标收货地址第二级地址（市）
      district: props.customer_shipping_address.district, // 国标收货地址第三级地址（区）
      address: props.customer_shipping_address.address_1, // 详细收货地址信息
      nationalCode: '', // 收货地址国家码
      telephone: props.customer_shipping_address.telephone // 收货人手机号码
    }
    this.isValid = this.validData(this.state)
    this.isWechat = props.isWechat
  }

  componentDidMount() {
    const { isQueryData, getAddressInfo, verifyAddreddRefFn } = this.props
    getAddressInfo(this.getData(isQueryData))
    if (this.isWechat) {
      setTimeout(() => wxInit(), 100)
    }
    if (this.props.isMiniApp) {
      // NOTE:小程序返回
      window.addEventListener('hashchange', this.handleChangeHash, false)
    }
    verifyAddreddRefFn && verifyAddreddRefFn(this.handleAddress)
  }

  componentWillUnmount() {
    // NOTE:小程序返回
    window.removeEventListener('hashchange', this.handleChangeHash, false)
  }

  handleChangeHash = e => {
    const oldData = parseHashString(e.oldURL)
    const newData = parseHashString(e.newURL)
    if (
      oldData.router > newData.router ||
      (!newData.router && oldData.router)
    ) {
      browserHistory.go(`-${oldData.router}`)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { customer_shipping_address } = this.props
    if (
      this.isChangedValue(
        customer_shipping_address,
        nextProps.customer_shipping_address
      )
    ) {
      this.setState(
        {
          isSuccess: false,
          full_name: nextProps.customer_shipping_address.full_name, // 收货人姓名
          zip_code: nextProps.customer_shipping_address.zip_code, // 邮编
          state: nextProps.customer_shipping_address.state, // 国标收货地址第一级地址（省）
          city: nextProps.customer_shipping_address.city, // 国标收货地址第二级地址（市）
          district: nextProps.customer_shipping_address.district, // 国标收货地址第三级地址（区）
          address: nextProps.customer_shipping_address.address_1, // 详细收货地址信息
          nationalCode: '', // 收货地址国家码
          telephone: nextProps.customer_shipping_address.telephone // 收货人手机号码
        },
        () => {
          this.isValid = this.validData(this.state)
          const { isQueryData, getAddressInfo } = nextProps
          getAddressInfo(this.getData(isQueryData))
        }
      )
    }
  }

  isChangedValue = (oldValue, newValue) => {
    if (_.isEmpty(oldValue) && !_.isEmpty(newValue)) {
      return true
    } else {
      const isChanged =
        newValue.address_1 !== oldValue.address_1 ||
        newValue.state !== oldValue.state ||
        newValue.city !== oldValue.city ||
        newValue.telephone !== oldValue.telephone ||
        newValue.full_name !== oldValue.full_name ||
        newValue.zip_code !== oldValue.zip_code
      return isChanged
    }
  }

  validData = data =>
    !!(
      data.address &&
      data.state &&
      data.city &&
      data.telephone &&
      data.full_name &&
      data.zip_code
    )

  getData = isQueryData => {
    const { customer_shipping_address } = this.props
    const { address, state, city, zip_code, telephone, full_name } = this.state
    const isChanged =
      customer_shipping_address.address_1 !== address ||
      customer_shipping_address.state !== state ||
      customer_shipping_address.city !== city ||
      customer_shipping_address.telephone !== telephone ||
      customer_shipping_address.full_name !== full_name ||
      customer_shipping_address.zip_code !== zip_code
    return {
      isValid: this.isValid,
      isChanged: isChanged || isQueryData,
      addressInfo: this.state
    }
  }

  handleAddress = async () => {
    if (!this.isWechat) {
      this.otherGetAddress()
    }
    if (this.props.isMiniApp && !this.isNavigating) {
      this.isNavigating = true
      navigateToAddress(window.location.href)
      await delay(1000)
      this.isNavigating = false
      return null
    }
    wx.ready(() => {
      wx.openAddress({
        success: res => {
          const validAddress = {
            isSuccess: true,
            full_name: res.userName,
            zip_code: res.postalCode,
            state: res.provinceName,
            city: res.cityName,
            district: res.countryName,
            address: res.detailInfo,
            nationalCode: res.nationalCode,
            telephone: res.telNumber
          }
          this.isShowHint = !isValidChineseName(res.userName)
          this.setState(validAddress, () => {
            this.isValid = this.validData(this.state)
            this.props.getAddressInfo(this.getData())
          })
        },
        fail: error =>
          error.errMsg !== 'openAddress:fail' &&
          wxInit(true, this.handleAddress)
      })
    })
  }

  otherGetAddress = () => {
    browserHistory.push('/address')
  }

  hideHint = () => {
    this.isShowHint = false
    this.forceUpdate()
  }

  handleChangeAddress = () => {
    this.hideHint()
    this.handleAddress()
  }

  render() {
    const { full_name, telephone, state, city, address, district } = this.state,
      { hasDefaultValue, isShowInfo, title, tipText } = this.props
    const hasPersonInfo = !!(hasDefaultValue || isShowInfo)
    return (
      <div className="wx-address-info">
        {hasPersonInfo ? (
          <div className="bg-color">
            <div className="full-name-tel">
              {(hasDefaultValue || isShowInfo) && `${full_name}  ${telephone}`}
            </div>
            <div
              className="detail-adress-info"
              onClick={_.debounce(this.handleAddress, 500, {
                leading: true
              })}
            >
              {`${state}${city}${district}${address}`}
            </div>
            <span
              onClick={_.debounce(this.handleAddress, 500, {
                leading: true
              })}
              className="address-icon address-icon-fix-right"
            />
          </div>
        ) : (
          <div
            onClick={_.debounce(this.handleAddress, 500, {
              leading: true
            })}
          >
            <div className="send-title">{title}</div>
            <div className="tips-text">{tipText}</div>
            <span className="address-icon" />
          </div>
        )}
        {!_.isEmpty(full_name) && !isValidChineseName(full_name) && (
          <div className="username-tips">
            <span className="icon" />
            根据国家主管部门要求实行实名收寄，请填写真实姓名
          </div>
        )}
      </div>
    )
  }
}

WxAddress.propTypes = {
  title: PropTypes.string,
  tipText: PropTypes.string,
  getAddressInfo: PropTypes.func.isRequired,
  customer_shipping_address: PropTypes.object,
  isShowInfo: PropTypes.bool.isRequired,
  hasDefaultValue: PropTypes.bool
}

WxAddress.defaultProps = {
  title: `地址信息`,
  tipText: `请选择地址信息`,
  getAddressInfo: () => {},
  customer_shipping_address: {},
  isShowInfo: false,
  hasDefaultValue: false
}
