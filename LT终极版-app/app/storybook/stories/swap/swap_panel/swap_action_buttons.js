/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import SwapActions from '../../../../src/expand/tool/swap'
import { abTrack } from '../../../../src/components/ab_testing'

export default class BottomView extends PureComponent {
  _getToteSlotStatus = () => {
    const {
      currentProduct,
      selectedProducts,
      isOnboarding,
      voidCount
    } = this.props
    const toteSlot = currentProduct.tote_slot

    let message = '替换这件'
    if (toteSlot > 1 && !isOnboarding && selectedProducts.length) {
      const count = SwapActions.getToteSlot(selectedProducts) + voidCount
      message = `替换这件(${count > toteSlot ? toteSlot : count}/${toteSlot})`
    }
    return message
  }
  _toteActions = () => {
    const {
      swapCurrentTote,
      selectedProducts,
      currentProduct,
      currentProductSize,
      isOnboarding,
      voidCount
    } = this.props

    const ok = SwapActions.canSwapWithProductInToteCart(
      [currentProduct],
      selectedProducts,
      voidCount,
      isOnboarding
    )
    if (ok) {
      swapCurrentTote &&
        swapCurrentTote(
          selectedProducts,
          currentProduct,
          currentProductSize,
          voidCount
        )
      if (isOnboarding) {
        abTrack('onboarding_12', 1)
      }
    }
  }

  render() {
    const { selectedProducts } = this.props
    const buttonMessage = this._getToteSlotStatus()
    const disabled = !selectedProducts.length
    return (
      <View style={styles.bottomView}>
        <TouchableOpacity
          disabled={disabled}
          style={[
            styles.bottomButton,
            disabled && {
              backgroundColor: 'rgba(234,92,57,0.3)'
            }
          ]}
          onPress={this._toteActions}>
          <Text style={styles.actionTitle}>{buttonMessage}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bottomView: {
    height: 50,
    flexDirection: 'row',
    marginRight: 15,
    justifyContent: 'space-between'
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 10,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA5C39'
  },
  actionTitle: {
    color: 'white',
    fontWeight: '600'
  }
})
