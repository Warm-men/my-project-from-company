import React, { Component } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Image from '../image'
import { inject, observer } from 'mobx-react'
@inject('currentCustomerStore')
@observer
export default class ShoppingCarIcon extends Component {
  goToteCart = () => {
    const { onPress, navigation } = this.props
    onPress && onPress()
    navigation.navigate('ShoppingCar')
  }

  render() {
    const { style, currentCustomerStore } = this.props
    if (!currentCustomerStore.displayCartEntry) {
      return <View />
    }
    return (
      <TouchableOpacity
        style={style}
        onPress={this.goToteCart}
        hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}>
        <Image source={require('../../../assets/images/totes/car_icon.png')} />
      </TouchableOpacity>
    )
  }
}
