/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'

export default class SelectButton extends PureComponent {
  _didSelectedItem = () => {
    const { onPress, type } = this.props
    onPress(type)
  }
  render() {
    const { scheduledPickupsType, text, type } = this.props
    const onFocus = type === scheduledPickupsType
    const textStateStyle = onFocus ? styles.onFocusText : styles.onBlureText
    return (
      <TouchableOpacity
        style={styles.buttonView}
        activeOpacity={0.85}
        onPress={this._didSelectedItem}>
        <Text testID="button-text" style={[styles.buttonItem, textStateStyle]}>
          {text}
        </Text>
        {onFocus && <View testID="focus-line" style={styles.lineView} />}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  lineView: {
    width: 22,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#F2BE7D',
    marginBottom: 2
  },
  buttonView: {
    alignItems: 'center',
    marginRight: 16
  },
  buttonItem: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 13
  },
  onFocusText: {
    color: '#333'
  },
  onBlureText: {
    color: '#CCC'
  }
})
