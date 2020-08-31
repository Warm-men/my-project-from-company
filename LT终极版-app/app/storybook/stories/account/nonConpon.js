import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Image from '../image'
import p2d from '../../../src/expand/tool/p2d'

export default class NonConpon extends PureComponent {
  render() {
    return (
      <View style={styles.notConpon}>
        <Image
          style={styles.notConponImage}
          source={require('../../../assets/images/account/noConpon.png')}
          resizeMode="cover"
        />
        <Text style={styles.notConponText}>暂无优惠券</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  notConpon: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  notConponImage: {
    marginTop: p2d(-80)
  },
  notConponText: {
    fontSize: 16,
    color: '#999',
    marginTop: 24
  }
})
