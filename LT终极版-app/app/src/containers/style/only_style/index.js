/* @flow */

import React, { Component } from 'react'
import { DeviceEventEmitter } from 'react-native'
import StyleContainer from './style'
import { RuleTipsView } from '../../../../storybook/stories/style'
import { Mutate, SERVICE_TYPES } from '../../../expand/services/services.js'
import { inject } from 'mobx-react'
import {
  DRESS_SIZES,
  PANT_SIZES,
  TOP_SIZES_ABBR,
  SKIRT_SIZES
} from '../../../expand/tool/size/size'
@inject('currentCustomerStore', 'modalStore', 'appStore')
export default class OnlyStyleContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { scrollIndex: 0, style: {}, isReceivedRule: true }
    this.style = {}
    this.isCommitting = false
    this._scrollView = null
  }

  componentDidMount() {
    const { currentCustomerStore } = this.props
    const hasCompleteSizes = currentCustomerStore.hasCompleteSizes()
    if (!hasCompleteSizes) {
      if (!currentCustomerStore.firstDeliveredTote) {
        this.showhasRuletips()
      } else {
        this.goSizeEdit()
      }
    }
  }

  showhasRuletips = () => {
    const { modalStore } = this.props
    modalStore.show(<RuleTipsView changeHasRule={this.changeHasRule} />)
  }

  changeHasRule = isReceivedRule => {
    const { modalStore } = this.props
    this.setState({ isReceivedRule })
    modalStore.hide()
    if (isReceivedRule) {
      this.goSizeEdit()
    }
  }

  sizeOrder = () => {
    const { currentCustomerStore } = this.props
    const { style } = currentCustomerStore
    const { MEASUREMENT_KEYS } = style
    const not_finished_key_style =
      MEASUREMENT_KEYS &&
      MEASUREMENT_KEYS.find(item => {
        return !style[item]
      })
    return not_finished_key_style
  }

  goSizeEdit = () => {
    const { currentCustomerStore, navigation } = this.props
    const { style } = currentCustomerStore
    const { height_inches, weight } = style
    const not_finished_key_style = this.sizeOrder()
    if (not_finished_key_style) {
      navigation.navigate('EditSize', {
        type: not_finished_key_style,
        height_inches,
        weight
      })
    }
  }

  componentWillUnmount() {
    const { params } = this.props.navigation.state
    const onRefreshSizeChart = params && params.onRefreshSizeChart
    this.isUpdatedStyle && onRefreshSizeChart && onRefreshSizeChart()
  }

  _updateStyle = style => {
    if (this.isCommitting) {
      return
    }
    this.style = { ...this.style, ...style }
  }

  //刷新style_card
  _updateStyleCard = () => {
    DeviceEventEmitter.emit('onRefreshTotes')
  }

  //尺码小助手进来的点击保存走的是这个方法，提交保存尺码刷新推荐
  saveSize = callback => {
    DRESS_SIZES.map(item => {
      if (item.name === this.style.dress_size) {
        this.style.dress_size = item.type
      }
    })
    PANT_SIZES.map(item => {
      if (item.name === this.style.pant_size) {
        this.style.pant_size = item.type
      }
    })
    TOP_SIZES_ABBR.map(item => {
      if (item.name === this.style.top_size) {
        this.style.top_size = item.type
      }
    })
    SKIRT_SIZES.map(item => {
      if (item.name === this.style.skirt_size) {
        this.style.skirt_size = item.type
      }
    })
    if (this.style.jean_size) {
      this.style.jean_size = parseInt(this.style.jean_size)
    }

    this.isCommitting = true

    var arr = Object.getOwnPropertyNames(this.style)
    if (arr.length === 0) {
      this._updateStyleCard()
      this._updateRecommendedSize()
      return
    }
    this.style.rescheduled_product_sizer = true
    this.style.require_incentive = true

    Mutate(
      SERVICE_TYPES.me.MUTAITON_UPDATE_STYLE,
      { input: this.style },
      response => {
        this.isUpdatedStyle = true
        const {
          style,
          incentive_url,
          incentive_granted
        } = response.data.UpdateStyle

        this.props.currentCustomerStore.updateStyle(style)
        this._updateStyleCard()

        const url = incentive_granted && incentive_url ? incentive_url : ''
        this._updateRecommendedSize(url)
        callback && callback()
      },
      () => {
        callback && callback()
        this.isCommitting = false
      }
    )
  }

  _updateRecommendedSize = url => {
    const { params } = this.props.navigation.state
    Mutate(
      SERVICE_TYPES.totes.MUTATION_TOTE_QUEUE_PRODUCT_SIZER,
      { input: {} },
      () => {
        if (params && params.styleIncomplete) {
          this.isCommitting = false
        }
        if (url) {
          this.props.navigation.replace('WebPage', {
            uri: url,
            hideShareButton: true
          })
          return
        }
        if (params && params.singlePage) {
          // 这是从尺码小助手进来的推荐需要返回两层
          this.props.navigation.pop(2)
        } else {
          this.props.navigation.goBack()
        }
      },
      () => {
        this.isCommitting = false
      }
    )
  }

  returnTitle = () => {
    const { params } = this.props.navigation.state
    let title = `尺码`
    if (params && params.confirm) {
      title = `确认个人尺码`
    }
    return title
  }

  returnDescription = () => {
    const { params } = this.props.navigation.state
    let description = `我们始终坚持手工测量每件衣服，只需提供尺码信息，托特衣箱就能为你推荐最合身的尺码`
    if (params && params.confirm) {
      description = `建议测量并核对个人尺码信息，如果尺码有误请尽快更新，确认无误后可点击底部按钮告诉我们哦`
    }
    return description
  }

  returnConfirmButtonText = () => {
    const { params } = this.props.navigation.state
    let confirmButtonText = '下一步'
    if (params) {
      if (params.openProductsSizeFilter) {
        confirmButtonText = `开启智能选码`
      } else if (params.singlePage) {
        confirmButtonText = `立即推荐`
      } else if (params.styleIncomplete) {
        confirmButtonText = `保存`
      } else if (params.confirm) {
        confirmButtonText = `确认无误`
      }
    }
    return confirmButtonText
  }

  render() {
    const { currentCustomerStore, appStore, navigation } = this.props
    const { isReceivedRule } = this.state
    const title = this.returnTitle()
    const description = this.returnDescription()
    const confirmButtonText = this.returnConfirmButtonText()
    return (
      <StyleContainer
        currentCustomerStore={currentCustomerStore}
        appStore={appStore}
        navigation={navigation}
        saveSize={this.saveSize}
        updateStyle={this._updateStyle}
        style={this.style}
        confirmButtonText={confirmButtonText}
        title={title}
        description={description}
        isReceivedRule={isReceivedRule}
      />
    )
  }
}
