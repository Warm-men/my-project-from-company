/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'

export default class ToteFreeServiceTip extends PureComponent {
  render() {
    const { message, style } = this.props
    if (!message) return null
    return (
      <View style={[styles.container, style]}>
        <View style={styles.tipTextTitleView}>
          <Text style={styles.tipTextTitle}>自在选</Text>
        </View>
        <Text style={styles.tipText}>
          {'            '}
          {message}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: p2d(16),
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 3,
    paddingHorizontal: p2d(12),
    paddingVertical: p2d(6)
  },
  tipTextTitleView: {
    position: 'absolute',
    left: 12,
    top: 8,
    width: p2d(40),
    height: p2d(17),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    backgroundColor: '#242424',
    zIndex: 1
  },
  tipTextTitle: {
    fontSize: 11,
    color: '#E3B356'
  },
  tipText: {
    fontSize: 12,
    color: '#989898',
    letterSpacing: 0.2,
    lineHeight: 20
  }
})
