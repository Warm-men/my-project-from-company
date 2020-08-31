/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

export default class RatingIncentive extends PureComponent {
  render() {
    const { amount } = this.props
    return (
      <View style={styles.container}>
        <View>
          <Image
            source={require('../../../assets/images/rating/jiangli.png')}
          />
          <Text style={styles.price}>￥{amount}</Text>
          <Text style={styles.title}>{`献上${amount}元奖励金`}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  price: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    position: 'absolute',
    top: 25,
    left: 60
  },
  title: {
    fontSize: 14,
    position: 'absolute',
    bottom: 35,
    left: 34,
    color: '#242424'
  }
})
