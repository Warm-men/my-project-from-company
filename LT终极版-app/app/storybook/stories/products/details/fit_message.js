/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { getFitMessage } from '../../../../src/expand/tool/product_l10n'

export default class FitMessage extends PureComponent {
  render() {
    const { lockMessage } = this.props
    if (lockMessage) {
      return (
        <View style={styles.container}>
          <Text style={styles.fitMessage}>{lockMessage}</Text>
        </View>
      )
    }
    const { recommendedSize, fitMessages, selectedSize } = this.props
    const data = getFitMessage(recommendedSize, fitMessages, selectedSize)
    const { fitMessage, size } = data
    return (
      <View style={styles.container}>
        {!!fitMessage && (
          <Text style={styles.fitMessage}>
            {!!size && '推荐：'}
            {!!size && <Text style={styles.recommendedSize}>{size}</Text>}
            {fitMessage}
          </Text>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    borderRadius: 4,
    overflow: 'hidden'
  },
  fitMessage: {
    fontSize: 12,
    padding: 8,
    lineHeight: 20,
    color: '#666',
    fontWeight: '400',
    backgroundColor: '#f7f7f7'
  },
  recommendedSize: {
    color: '#E85C40'
  }
})
