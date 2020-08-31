import React, { Component } from 'react'
import WxAddress from 'src/app/components/wx_address_v2'
import { parseHashString } from 'src/app/lib/parseHashString.js'
import classnames from 'classnames'
import TimePicker from 'src/app/components/TimePicker'
import { format, addDays } from 'date-fns'
import { LAST_CITYTIME, getLastTime } from '../utils/handleTime.js'
import './index.scss'

export default class AutoPickup extends Component {
  constructor(props) {
    super(props)
    this.state = { dateTime: null, isShow: false }
    this.lastCityTime = LAST_CITYTIME
    this.address = null
  }

  handleTimePicker = () => {
    this.setState({
      isShow: true
    })
  }

  defaultShippingAddress = () => {
    return this.isHasQueryData() || this.isHasShippingAddress()
  }

  isHasShippingAddress = () => {
    const {
        full_name,
        telephone,
        state,
        city,
        district,
        address_1
      } = this.props.shipping_address,
      hasDefaultValue = !!(
        full_name &&
        telephone &&
        state &&
        city &&
        district &&
        address_1
      )
    return hasDefaultValue
  }

  isHasQueryData = () => {
    return !_.isEmpty(this.changeMiniAddress())
  }

  changeMiniAddress = () => {
    const { hash } = this.props.location
    if (_.isEmpty(hash)) {
      return {}
    }
    const hashValue = parseHashString(hash)
    return {
      full_name: hashValue.userName,
      zip_code: hashValue.postalCode,
      state: hashValue.provinceName,
      city: hashValue.cityName,
      district: hashValue.countyName,
      address_1: hashValue.detailInfo,
      nationalCode: hashValue.nationalCode,
      telephone: hashValue.telNumber
    }
  }

  handleDefaultData = () => {
    const { shipping_address } = this.props
    const changeMiniAddress = this.changeMiniAddress()
    const newShppingAddress = {
      ...shipping_address,
      ...changeMiniAddress
    }
    return newShppingAddress
  }

  handleConfirmTime = (date, time) => {
    let returnTime = null
    if (date === '今天') {
      returnTime = format(new Date(), 'YYYY-MM-DD')
    } else {
      returnTime = format(addDays(new Date(), 1), 'YYYY-MM-DD')
    }
    const dateTime = `${returnTime} ${time}`
    this.setState(
      {
        dateTime,
        isShow: false
      },
      () => {
        const { updateDateTime } = this.props
        updateDateTime && updateDateTime(dateTime)
      }
    )
  }

  handleCancelTime = () => this.setState({ isShow: false })

  getAddressInfo = async info => {
    this.lastCityTime = info.addressInfo && (await getLastTime(info))
    const isChanged =
      this.address && info.addressInfo.city !== this.address.addressInfo.city
    this.address = info
    const { updateCustomerShppingAddress } = this.props
    updateCustomerShppingAddress && updateCustomerShppingAddress(this.address)
    const dateTime = isChanged ? null : this.state.dateTime
    this.setState(
      {
        isValid: this.address.isValid,
        dateTime
      },
      () => {
        const { updateDateTime } = this.props
        updateDateTime && updateDateTime(dateTime)
      }
    )
  }

  render() {
    const { isWechat, isMiniApp, verifyAddreddRefFn } = this.props
    const timePikerClassName = classnames('fetch-time-picker', {
      'add-fontsize': !!this.state.dateTime
    })
    const customer_shipping_address = this.handleDefaultData()
    return (
      <div>
        <div className="time-box">
          <div className="fetch-time-title">取件时间</div>
          <div className={timePikerClassName} onClick={this.handleTimePicker}>
            <span className={'timePicker'}>
              {this.state.dateTime || '选择取件时间'}
            </span>
            <TimePicker
              lastCityTime={this.lastCityTime}
              onConfirm={this.handleConfirmTime}
              onCancel={this.handleCancelTime}
              visible={this.state.isShow}
            />
            <span className="fetch-time-icon" />
          </div>
        </div>
        <WxAddress
          title="取件地址"
          tipText="选择取件地址"
          isWechat={isWechat}
          isMiniApp={isMiniApp}
          verifyAddreddRefFn={verifyAddreddRefFn}
          isQueryData={this.isHasQueryData()}
          customer_shipping_address={customer_shipping_address}
          getAddressInfo={this.getAddressInfo}
          isShowInfo={this.state.isValid}
          hasDefaultValue={this.defaultShippingAddress()}
        />
      </div>
    )
  }
}
