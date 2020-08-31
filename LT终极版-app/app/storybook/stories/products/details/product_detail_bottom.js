/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated
} from 'react-native'
// eslink-disable-next-line
import AddToClosetButton from '../../../../src/containers/closet/add_to_closet_button'
import SwapActions from '../../../../src/expand/tool/swap'
import { updateViewableItemStatus } from '../../../../src/expand/tool/daq'
import FreeServiceBanner from './product_free_service_banner'
import Image from '../../image'

export default class DetailsBottomBar extends PureComponent {
  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
  }
  _animatedToteCartIcon = () => {
    Animated.sequence([
      Animated.timing(this.animatedValue, { toValue: 1, duration: 500 })
    ]).start(() => {
      this.animatedValue.setValue(0)
    })
  }

  getReportData = () => {
    const { product, column } = this.props
    return { variables: { id: product.id }, column, router: 'Details' }
  }
  _addToTote = () => {
    const { addToTote, product } = this.props
    addToTote && addToTote()

    //DAQ
    const data = this.getReportData()
    const { id } = product
    updateViewableItemStatus(id, { id, addToShoppingCar: true }, data)
  }
  render() {
    const {
      product,
      inSwap,
      goShoppingCar,
      selectedSize,
      inToteProduct,
      displayCartEntry,
      showFreeServiceBanner,
      goFreeService
    } = this.props
    const {
      disabled,
      buttonTitle
    } = SwapActions.getStatusWithAddToToteCartButton(
      selectedSize,
      inToteProduct,
      product
    )

    const rotate = this.animatedValue.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: ['0deg', '20deg', '0deg', '-20deg', '0deg']
    })
    return (
      <View>
        {showFreeServiceBanner && <FreeServiceBanner onPress={goFreeService} />}
        <View style={styles.bottomBar}>
          <AddToClosetButton
            getReportData={this.getReportData}
            product={product}
            inDetails={true}
            buttonStyle={
              inSwap ? styles.closetButtonInSwap : styles.closetButton
            }
            inSwap={inSwap}
            animationStyle={
              inSwap ? styles.inSwapAnimationStyle : styles.animationStyle
            }
            animationSource={
              inSwap
                ? require('../../../../assets/animation/like/like_pop_animation_red.json')
                : require('../../../../assets/animation/like/like_pop_animation_white.json')
            }
            inClosetText={inSwap ? '已收藏' : '已加入愿望衣橱'}
            outOfClosetText={inSwap ? '收藏' : '加入愿望衣橱'}
            buttonTextStyle={
              inSwap ? styles.buttonTextInSwap : styles.buttonText
            }
          />
          <View style={styles.line} />
          {displayCartEntry && (
            <TouchableOpacity
              style={styles.toteButton}
              onPress={goShoppingCar}
              activeOpacity={0.85}>
              <Animated.View
                style={[styles.toteCartView, { transform: [{ rotate }] }]}>
                <Image
                  source={require('../../../../assets/images/totes/car_icon.png')}
                  style={styles.toteCartIcon}
                />
              </Animated.View>
              <Text style={styles.toteButtonText}>下单</Text>
            </TouchableOpacity>
          )}
          {inSwap && (
            <TouchableOpacity
              disabled={disabled}
              style={[
                styles.addToClosetButton,
                disabled && { backgroundColor: 'rgba(234,92,57,0.3)' }
              ]}
              onPress={this._addToTote}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              activeOpacity={0.85}>
              <Text style={styles.addToClosetText}>{buttonTitle}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bottomBar: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#FFF'
  },
  closetButtonInSwap: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    width: 68,
    borderRightColor: '#e6e6e6',
    borderRightWidth: StyleSheet.hairLineWidth
  },
  closetButton: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    height: 44,
    flexDirection: 'row',
    backgroundColor: '#EA5C39'
  },
  line: {
    height: 34,
    width: 1,
    marginTop: 15,
    backgroundColor: '#f3f3f3'
  },
  toteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    marginBottom: 6,
    width: 68
  },
  toteCartView: { marginTop: 9, marginBottom: 2 },
  toteCartIcon: { width: 19, height: 19 },
  toteButtonText: { fontSize: 10, marginTop: 6, color: '#5e5e5e' },
  addToClosetButton: {
    flex: 1,
    margin: 8,
    marginRight: 16,
    height: 44,
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },
  addToClosetText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
  nonSwappable: {
    backgroundColor: '#F8CFC4'
  },
  iconBadge: {
    backgroundColor: '#EA5C39',
    width: 14,
    height: 14,
    borderRadius: 7,
    position: 'absolute',
    top: 2,
    right: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  animationStyle: {
    width: 112,
    height: 112,
    marginRight: -40,
    marginLeft: -40,
    marginTop: 2
  },
  inSwapAnimationStyle: {
    width: 180,
    height: 180,
    position: 'relative',
    top: -4
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600'
  },
  buttonTextInSwap: {
    position: 'absolute',
    bottom: 2,
    fontSize: 10,
    color: '#5e5e5e'
  }
})
