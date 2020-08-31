/* @flow */

import React, { Component } from 'react'
import { ScrollView, Dimensions, DeviceEventEmitter } from 'react-native'
import StyleContainer from './style'
import SizeContainer from './size'
import { RuleTipsView } from '../../../../storybook/stories/style'
import { Mutate, SERVICE_TYPES } from '../../../expand/services/services.js'
import { inject } from 'mobx-react'
import {
  DRESS_SIZES,
  PANT_SIZES,
  TOP_SIZES_ABBR,
  SKIRT_SIZES
} from '../../../expand/tool/size/size'
const width = Dimensions.get('window').width
@inject('currentCustomerStore', 'modalStore', 'appStore')
export default class StyleAndSizeContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { style: {}, scrollIndex: 0, isReceivedRule: true }
    this.style = {}
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

  //滚动到下一页。其实只是在scrollView上移动。并不是入栈
  _nextPage = () => {
    if (!this._scrollView) return

    this._scrollView.scrollTo({
      x: width * (this.state.scrollIndex + 1),
      animated: true
    })
    this.setState({ scrollIndex: this.state.scrollIndex + 1 })
  }
  //滚动到上一页。其实只是在scrollView上移动。并不是出栈
  _goback = () => {
    if (!this._scrollView) return

    this._scrollView.scrollTo({
      x: width * (this.state.scrollIndex - 1),
      animated: true
    })
    this.setState({ scrollIndex: this.state.scrollIndex - 1 })
  }

  _updateStyle = style => {
    this.style = { ...this.style, ...style }
    this.setState({ style: this.style })
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

    var arr = Object.getOwnPropertyNames(this.style)
    if (arr.length === 0) {
      this._updateStyleCard()
      this._updateRecommendedSize()
      return
    }
    this.style.rescheduled_product_sizer = true
    this.style.require_incentive = true
    this.setState({ style: this.style })
    Mutate(
      SERVICE_TYPES.me.MUTAITON_UPDATE_STYLE,
      { input: this.style },
      response => {
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
      }
    )
  }

  _updateRecommendedSize = url => {
    Mutate(
      SERVICE_TYPES.totes.MUTATION_TOTE_QUEUE_PRODUCT_SIZER,
      { input: {} },
      () => {
        if (url) {
          this.props.navigation.replace('WebPage', {
            uri: url,
            hideShareButton: true
          })
          return
        }
        this.props.navigation.goBack()
      }
    )
  }

  render() {
    const { currentCustomerStore, navigation, appStore } = this.props
    const { isReceivedRule, style } = this.state
    const title = `尺码`
    const description = `我们始终坚持手工测量每件衣服，只需提供尺码信息，托特衣箱就能为你推荐最合身的尺码`
    const confirmButtonText = '下一步'
    return (
      <ScrollView
        ref={scrollView => (this._scrollView = scrollView)}
        overScrollMode={'never'}
        horizontal={true}
        pagingEnabled={true}
        scrollEnabled={false}>
        <StyleContainer
          currentCustomerStore={currentCustomerStore}
          appStore={appStore}
          navigation={navigation}
          nextPage={this._nextPage}
          goback={this._goback}
          updateStyle={this._updateStyle}
          style={style}
          confirmButtonText={confirmButtonText}
          title={title}
          description={description}
          isReceivedRule={isReceivedRule}
        />
        <SizeContainer
          saveSize={this.saveSize}
          updateStyle={this._updateStyle}
          goback={this._goback}
          style={style}
        />
      </ScrollView>
    )
  }
}
