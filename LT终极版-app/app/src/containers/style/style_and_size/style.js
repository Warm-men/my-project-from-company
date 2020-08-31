/* @flow */

import React from 'react'
import AuthenticationComponent from '../../../components/authentication'
import {
  Mutate,
  SERVICE_TYPES,
  QNetwork
} from '../../../expand/services/services'
import Picker from 'react-native-letote-picker'
import { HEIGHTARRAY, WEIGHTARRAY } from '../../../expand/tool/size/size'
import { ModifySizeContainer } from '../../../../storybook/stories/style'
import { updateCustomerStyle } from '../../../expand/tool/me_style/request_helper'

export default class StyleContainer extends AuthenticationComponent {
  onSignIn() {
    this._getMyStyle()
  }
  constructor(props) {
    super(props)
    const { height_inches, weight } = props.currentCustomerStore.style
    this.state = {
      height_inches,
      weight,
      showFadeLayer: false
    }
    this.heightArr = HEIGHTARRAY()
    this.weightArr = WEIGHTARRAY()
    this.preStyle = props.currentCustomerStore.style
  }

  componentDidMount() {
    if (this.props.currentCustomerStore.id) {
      this._getMyStyle()
    }
  }

  _getMyStyle = () => {
    QNetwork(SERVICE_TYPES.me.QUERY_MY_STYLE, {}, response => {
      this.props.currentCustomerStore.updateStyle(response.data.me.style)
      const { height_inches, weight } = response.data.me.style
      this.setState({ height_inches, weight })
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
    const { nextPage, updateStyle } = this.props
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
    updateStyle && updateStyle(style)
    updateCustomerStyle(style)
    nextPage && nextPage()
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
      const { height_inches, weight } = this.state
      navigation.navigate('EditSize', { type, height_inches, weight })
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
    const { confirmButtonText, title, description, isReceivedRule } = this.props
    const { height_inches, weight } = this.state
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
