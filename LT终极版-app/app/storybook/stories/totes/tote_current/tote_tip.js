/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class ToteTip extends PureComponent {
  render() {
    const { message } = this.props
    if (!message) return null
    return (
      <View style={styles.container}>
        <Icon
          name={'information-outline'}
          size={16}
          color="#989898"
          style={styles.infoIcon}
        />
        <Text style={styles.tipText}>{message}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: p2d(16),
    marginTop: p2d(16),
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 3,
    paddingHorizontal: p2d(12),
    paddingVertical: p2d(6)
  },
  infoIcon: {
    marginTop: 1,
    marginRight: 3
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#989898',
    letterSpacing: 0.2,
    lineHeight: 20
  }
})
