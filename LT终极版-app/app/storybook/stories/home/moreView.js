/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import p2d from '../../../src/expand/tool/p2d'

export default class MoreView extends PureComponent {
  render() {
    return (
      <View style={styles.moreView}>
        <Text style={styles.moreText}>{'MORE'}</Text>
        <Icon name={'md-arrow-dropright'} size={18} style={styles.icon} />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  moreView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  moreText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
    letterSpacing: 5
  },
  icon: {
    color: '#999',
    marginTop: p2d(2),
    marginLeft: p2d(5)
  }
})
