/* @flow */

import React, { PureComponent } from 'react'
import {
  getBookingInformation,
  getCityDeadLine,
  getReturnTime
} from '../../../expand/tool/tote_return_scheduled'
import { GET, SERVICE_TYPES } from '../../../expand/services/services'
import Picker from 'react-native-letote-picker'
import booking from '../../../expand/tool/booking'
import Statistics from '../../../expand/tool/statistics'

export default class BookingPicker extends PureComponent {
  constructor(props) {
    super(props)
    this.didBooked = false
    this.cityTime = null
    this.bookings = []
    this.listeners = []
  }

  componentDidMount() {
    this.listeners.push(
      this.props.navigation.addListener('willBlur', () => {
        Picker.hide()
      })
    )
    this._getCityTime()
  }

  componentWillUnmount() {
    this.listeners.map(item => {
      item.remove()
    })
    Picker.hide()
  }

  _getCityTime = () => {
    GET(SERVICE_TYPES.citytime.FETCH_CITYTIME, {}, response => {
      this.cityTime = response
    })
  }

  _updateReturnTime = () => {
    const { updateReturnTime, updateBookingDetails } = this.props
    const time = getReturnTime(this.bookings)
    const bookingDetail = getBookingInformation(this.bookings)
    time && updateReturnTime(time)
    updateBookingDetails && updateBookingDetails(bookingDetail)
  }

  //选择预约时间
  _booking = () => {
    const { shippingAddress } = this.props
    const cityDeadLine = getCityDeadLine(shippingAddress, this.cityTime)
    const getBooking = booking(cityDeadLine)
    const pickerData = getBooking.bookingDate
    Picker.init({
      pickerData: pickerData,
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      wheelFlex: [1, 1, 1],
      pickerTitleText: '选择预约时间',
      onPickerConfirm: time => {
        if (!this.didBooked && time) {
          Statistics.onEvent({
            id: 'fill_in_returnTote_booking',
            label: '填写归还时间'
          })
        }
        this.didBooked = true
        this.bookings = time
        this._updateReturnTime()
      }
    })
    Picker.show()
  }

  //重置预约归还时间
  _resetReturnTime = () => {
    this.bookings = []
    this.didBooked = false
    this.props.updateReturnTime(null)
  }

  render() {
    return <></>
  }
}
