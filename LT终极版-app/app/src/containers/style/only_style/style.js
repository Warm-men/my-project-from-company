/* @flow */

import React from 'react'
import AuthenticationComponent from '../../../components/authentication'
import { DeviceEventEmitter } from 'react-native'
import {
  Mutate,
  SERVICE_TYPES,
  QNetwork
} from '../../../expand/services/services'
import Picker from 'react-native-letote-picker'
import {
  HEIGHTARRAY,
  WEIGHTARRAY,
  DRESS_SIZES,
  TOP_SIZES_ABBR,
  SHAPELARGE
} from '../../../expand/tool/size/size'
import { calSize } from '../../../expand/tool/size/calSize'
import { ModifySizeContainer } from '../../../../storybook/stories/style'

export default class StyleContainer extends AuthenticationComponent {
  onSignIn() {
    this._getMyStyle()
  }
  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    const { height_inches, weight } = props.currentCustomerStore.style
    this.state = {
      height_inches:
        params && params.height_inches ? params.height_inches : height_inches,
      weight: params && params.weight ? params.weight : weight,
      showFadeLayer: false
    }
    this.heightArr = HEIGHTARRAY()
    this.weightArr = WEIGHTARRAY()
    this.dress_size, this.top_size
    this.preStyle = props.currentCustomerStore.style
  }

  componentDidMount() {
    if (this.props.currentCustomerStore.id) {
      this._getMyStyle()
    }
  }

  _getMyStyle = () => {
    const { params } = this.props.navigation.state
    QNetwork(SERVICE_TYPES.me.QUERY_MY_STYLE, {}, response => {
      const { height_inches, weight } = response.data.me.style
      this.props.currentCustomerStore.updateStyle(response.data.me.style)
      const data = {
        height_inches:
          params && params.height_inches
            ? height_inches
              ? height_inches
              : params.height_inches
            : height_inches,
        weight:
          params && params.weight ? (weight ? weight : params.weight) : weight
      }
      this.setState(data)
    })
  }

  _updateRecommendedSize = () => {
    Mutate(
      SERVICE_TYPES.totes.MUTATION_TOTE_QUEUE_PRODUCT_SIZER,
      { input: {} },
      () => {
        this.props.navigation.goBack()
        // FIXME: 更新详情页面
      }
    )
  }

  _alert = textValue => {
    const { appStore } = this.props
    appStore.showToastWithOpacity(textValue)
  }

  _updateCurrentSize = value => {
    let state = {}
    let style = {}
    let values = value.data
    state[value.dataType] = values
    style[value.dataType] = parseInt(values[0])
    this.setState(state)
    const { updateStyle } = this.props
    updateStyle && updateStyle(style)
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _signInCustomer = () => {
    this.props.currentCustomerStore.setLoginModalVisible(true)
  }

  nextStep = () => {
    const { params } = this.props.navigation.state
    const { updateStyle, saveSize } = this.props
    const { currentCustomerStore } = this.props
    if (!currentCustomerStore.id) {
      this._signInCustomer()
      return
    }
    if (!this.state.height_inches || !this.state.weight) {
      this._alert('填写必填项才能推荐尺码哟')
      return
    }
    let style = {
      height_inches: parseInt(this.state.height_inches),
      weight: parseInt(this.state.weight)
    }
    const hasCompleteSizes = currentCustomerStore.hasCompleteSizes(style)
    const openProductsSizeFilter = params && params.openProductsSizeFilter
    if (openProductsSizeFilter && !hasCompleteSizes) {
      //如果是智能选码进来，没有填完尺码不能点确认
      return
    }
    if (params && (params.singlePage || params.styleIncomplete)) {
      let size = calSize(this.state.height_inches, this.state.weight * 2, 3)
      DRESS_SIZES.map(item => {
        if (item.name === size) {
          this.dress_size = item.type
        }
      })
      TOP_SIZES_ABBR.map(item => {
        if (item.name === size) {
          this.top_size = item.type
        }
      })
    }
    if (!this.preStyle.top_size && this.top_size) {
      style.top_size = this.top_size
    }
    if (!this.preStyle.dress_size && this.dress_size) {
      style.dress_size = parseInt(this.dress_size)
    }
    let isDiff = this._diffStyle(this.preStyle, style)
    if (isDiff) {
      DeviceEventEmitter.emit('onRefreshSize', { style: style })
    }
    updateStyle(style)
    saveSize(openProductsSizeFilter ? this._openProductsSizeFilter : null)
  }

  _diffStyle = (preStyle, nextStyle) => {
    return (
      preStyle.height_inches !== nextStyle.height_inches ||
      preStyle.weight !== nextStyle.weight
    )
  }

  _openProductsSizeFilter = () => {
    DeviceEventEmitter.emit('toggleProductSizeFilter', {
      isFinishedStyleEdit: true
    })
  }

  _getBodyTypePosition = shape => {
    let bodyTypePosition
    shape
      ? SHAPELARGE.map((item, index) => {
          SHAPELARGE[index].type === shape ? (bodyTypePosition = index) : null
        })
      : (bodyTypePosition = null)
    return bodyTypePosition
  }

  _changeMySize = type => {
    Picker.hide()
    const { navigation, isReceivedRule } = this.props
    if (type === 'shape') {
      navigation.navigate('MeStyleShape', { isModifyShape: true })
    } else {
      if (!isReceivedRule) {
        this._alert('请签收卷尺后再填写')
        return
      }
      navigation.navigate('EditSize', { type })
    }
  }

  _toggleFadeLayer = () => {
    this.setState({ showFadeLayer: !this.state.showFadeLayer }, () => {
      if (!this.state.showFadeLayer) {
        Picker.hide()
      }
    })
  }

  render() {
    const {
      confirmButtonText,
      title,
      description,
      navigation,
      isReceivedRule
    } = this.props
    const { height_inches, weight } = this.state
    const { params } = navigation.state
    const openProductsSizeFilter = params && params.openProductsSizeFilter
    return (
      <ModifySizeContainer
        confirmButtonText={confirmButtonText}
        title={title}
        description={description}
        isReceivedRule={isReceivedRule}
        showFadeLayer={this.state.showFadeLayer}
        toggleFadeLayer={this._toggleFadeLayer}
        goBack={this._goBack}
        updateCurrentSize={this._updateCurrentSize}
        openProductsSizeFilter={openProductsSizeFilter}
        heightArr={this.heightArr}
        weightArr={this.weightArr}
        heightInches={height_inches}
        weight={weight}
        changeMySize={this._changeMySize}
        nextStep={this.nextStep}
      />
    )
  }
}
