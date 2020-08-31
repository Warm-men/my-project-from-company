/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class Bubble extends PureComponent {
  render() {
    const { text, style } = this.props
    return (
      <View style={[styles.container, style]}>
        <View style={styles.arrow} />
        <View style={styles.content}>
          <Text style={styles.guideText}>{text}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end'
  },
  arrow: {
    borderWidth: 6,
    borderColor: 'transparent',
    borderBottomColor: '#000',
    marginRight: 10
  },
  guideText: {
    lineHeight: 28,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    color: '#fff',
    overflow: 'hidden',
    fontSize: 13
  }
})
