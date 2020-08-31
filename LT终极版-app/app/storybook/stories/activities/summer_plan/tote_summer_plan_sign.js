/* @flow weak */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Image from '../../image'
export default class SummerPlanToteSign extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../../../../assets/images/activities/gift_icon.png')}
          style={styles.image}
        />
        <Text style={styles.text}>
          {'托特衣箱升级季期间，已额外增加一个衣位'}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF6E9',
    borderRadius: 2,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  image: {
    width: 16,
    height: 14
  },
  text: {
    fontWeight: '400',
    fontSize: 12,
    color: '#E89140',
    letterSpacing: 0.2,
    paddingLeft: 10
  }
})
