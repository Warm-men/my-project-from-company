/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Image from '../../image'

export default class ClothesCouponItem extends PureComponent {
  _didSelectedItem = () => {
    const { useCoupon } = this.props
    useCoupon && useCoupon()
  }

  render() {
    const { index } = this.props
    return (
      <View style={[!index && styles.productFirstItem, styles.productItem]}>
        <TouchableOpacity onPress={this._didSelectedItem} style={styles.view}>
          <Image
            source={require('../../../../assets/images/totes/use_clothes_coupon.png')}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  productFirstItem: {
    marginLeft: 8
  },
  productItem: {
    marginRight: 8,
    paddingTop: 20
  },
  view: {
    width: 76,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F2'
  }
})
