/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import { inject } from 'mobx-react'
import TopView from './choose_product_details'
import BottomView from './choose_action_buttons'
import BodyView from './choose_body'
import SwapActions from '../../../../src/expand/tool/swap'

@inject('appStore', 'panelStore', 'currentCustomerStore')
export default class ChooseSize extends PureComponent {
  constructor(props) {
    super(props)
    const selectedSize = this._getDefaultSelectedSize()
    this.state = { selectedSize }
  }
  _onSelectProductSize = selectedSize => {
    this.setState({ selectedSize })
  }
  _cancel = () => {
    this.props.panelStore.hide()
  }
  _didFinished = () => {
    const { didFinished, product, appStore } = this.props
    if (this.state.selectedSize) {
      didFinished && didFinished(product, this.state.selectedSize)
      this._cancel()
    } else {
      appStore.showToastWithOpacity('请先选择尺码')
    }
  }

  _getDefaultSelectedSize = () => {
    const { product, inToteProduct, recommendedSize } = this.props
    let selectedSize
    if (inToteProduct) {
      selectedSize = inToteProduct.product_size
    } else if (recommendedSize) {
      const recommendProductSize = product.product_sizes.find(item => {
        return item.size.id === recommendedSize.id
      })

      if (recommendProductSize && recommendProductSize.swappable) {
        selectedSize = recommendProductSize
      }
    }
    return selectedSize
  }

  render() {
    const {
      product,
      inToteProduct,
      recommendedSize,
      fitMessages,
      lockMessage,
      currentCustomerStore
    } = this.props
    const {
      disabled,
      buttonTitle
    } = SwapActions.getStatusWithAddToToteCartButton(
      this.state.selectedSize,
      inToteProduct,
      product
    )
    const hasStylesForRecommend = currentCustomerStore.hasStylesForRecommend()

    return (
      <View style={styles.container}>
        <TopView product={product} cancel={this._cancel} />
        <BodyView
          data={product.product_sizes}
          isAccessory={product.category.accessory}
          didSelectedItem={this._onSelectProductSize}
          selectedSize={this.state.selectedSize}
          recommendedSize={recommendedSize}
          fitMessages={fitMessages}
          inToteProduct={inToteProduct}
          lockMessage={lockMessage}
          hasStylesForRecommend={hasStylesForRecommend}
        />
        <BottomView
          didSelectedSize={this._didFinished}
          disabled={disabled}
          buttonTitle={buttonTitle}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  sizeView: {
    paddingLeft: 0,
    borderBottomWidth: 0,
    paddingTop: 15
  }
})
