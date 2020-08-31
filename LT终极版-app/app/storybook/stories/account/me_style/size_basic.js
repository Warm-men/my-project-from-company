import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import Title from './title'
import PickerMeSizeCircular from '../picker_me_size_circular'
import {
  PANT_SIZES,
  TOP_SIZES_ABBR,
  DRESS_SIZES,
  SKIRT_SIZES
} from '../../../../src/expand/tool/size/size'
import { getNumberSize } from '../../../../src/expand/tool/me_style/shape'
import Stores from '../../../../src/stores/stores'
import { CustomAlertView } from '../../alert/custom_alert_view'
import { updateCustomerStyle } from '../../../../src/expand/tool/me_style/request_helper'

export default class SizeBasic extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      style: {
        topSize: null,
        pantSize: null,
        dressSize: null,
        skirtSize: null
      }
    }
    this.showCheckAlert = true
  }

  sizeChange = value => {
    let style = {}
    if (this.state.style[value.dataType] !== value.data) {
      let values = value.data
      style[value.dataType] = values
      let newStyle = { ...this.state.style, ...style }
      this.setState({ style: newStyle })
    }
    this.showCheckAlert = false
  }
  isDone = () => {
    const { topSize, pantSize, dressSize, skirtSize } = this.state.style
    if (!topSize || !pantSize || !dressSize || !skirtSize) {
      return false
    }
    return true
  }

  updateData = () => {
    const { top_size, pant_size, dress_size, skirt_size } = this.props.style
    if (top_size && pant_size && dress_size && skirt_size) {
      this.showCheckAlert = false
    }
    if (this.isDone()) {
      if (this.showCheckAlert) {
        this._alertCheck()
        return 'CHECK_SIZE_TRUE'
      }
      if (this.needToRefresh()) {
        const { topSize, pantSize, dressSize, skirtSize } = this.state.style
        const style = {
          top_size: topSize,
          pant_size: pantSize,
          dress_size: dressSize,
          skirt_size: skirtSize
        }
        updateCustomerStyle(style)
      }
      return true
    } else {
      return false
    }
  }
  componentDidMount() {
    this._calSize(this.props.style)
  }
  _alertCheck = () => {
    Stores.modalStore.show(
      <CustomAlertView
        message={'常穿尺码都正确吗？'}
        cancel={{ title: '我再看看', type: 'highLight' }}
        other={[{ title: '是的', type: 'highLight', onClick: this._next }]}
      />
    )
    return
  }
  _next = () => {
    this.showCheckAlert = false
    const { next } = this.props
    if (this.needToRefresh()) {
      const { topSize, pantSize, dressSize, skirtSize } = this.state.style
      const style = {
        top_size: topSize,
        pant_size: pantSize,
        dress_size: dressSize,
        skirt_size: skirtSize
      }
      updateCustomerStyle(style)
    }
    next()
  }

  _calSize = () => {
    const { topSize, pantSize, dressSize, skirtSize } = getNumberSize()
    this.setState({
      style: {
        topSize: topSize,
        pantSize: pantSize,
        dressSize: dressSize,
        skirtSize: skirtSize
      }
    })
  }
  needToRefresh = () => {
    const { topSize, pantSize, dressSize, skirtSize } = this.state.style
    const { top_size, pant_size, dress_size, skirt_size } = this.props.style
    return (
      topSize !== top_size ||
      pant_size !== pantSize ||
      dress_size !== dressSize ||
      skirt_size != skirtSize
    )
  }
  render() {
    const { style } = this.state

    return (
      <View>
        <Title title={'请核对你的常穿尺码'} />
        <PickerMeSizeCircular
          numColumns={4}
          size={style.topSize}
          sizeChange={this.sizeChange}
          title={'上衣'}
          dataType={'topSize'}
          data={TOP_SIZES_ABBR}
        />
        <PickerMeSizeCircular
          numColumns={4}
          size={style.pantSize}
          sizeChange={this.sizeChange}
          title={'裤子'}
          dataType={'pantSize'}
          data={PANT_SIZES}
        />
        <PickerMeSizeCircular
          numColumns={4}
          size={style.dressSize}
          sizeChange={this.sizeChange}
          title={'连衣裙'}
          dataType={'dressSize'}
          data={DRESS_SIZES}
        />
        <PickerMeSizeCircular
          numColumns={4}
          size={style.skirtSize}
          sizeChange={this.sizeChange}
          title={'半裙'}
          dataType={'skirtSize'}
          data={SKIRT_SIZES}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({})
