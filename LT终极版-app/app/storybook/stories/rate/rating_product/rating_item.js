/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'

export default class RatingButton extends PureComponent {
  _onPress = () => {
    const { onPress, item } = this.props
    onPress && onPress(item)
  }
  render() {
    const { isSelected, style, item } = this.props
    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={[
          styles.container,
          isSelected ? styles.selected : styles.normal,
          style
        ]}>
        <Text
          style={[
            styles.title,
            isSelected ? styles.selectedTitle : styles.normalTitle
          ]}>
          {item.display}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: p2d(72, { maxLock: true }),
    height: 32,
    borderRadius: 50,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: p2d(12, { maxLock: true })
  },
  normal: { borderColor: '#ccc' },
  selected: { borderColor: '#E85C40', backgroundColor: '#FDEDE9' },
  title: { fontSize: 12 },
  normalTitle: { color: '#5E5E5E' },
  selectedTitle: { color: '#E85C40' }
})
