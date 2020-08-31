/* @flow */

import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'

export default class SelectButton extends PureComponent {
  _onPress = () => {
    const { type, onPress } = this.props
    onPress(type)
  }
  render() {
    const { selectStatus, type, text } = this.props
    const textStyle =
      selectStatus === type ? styles.onFocusText : styles.onBlureText
    const buttonStyle = selectStatus === type ? styles.onFocus : styles.onBlure
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={this._onPress}
        style={[styles.buttonItem, buttonStyle]}>
        <Text style={textStyle}>{text}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  buttonItem: {
    width: 104,
    height: 32,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  onFocusText: {
    fontSize: 14,
    color: '#FFFFFF'
  },
  onBlureText: {
    color: '#5E5E5E',
    fontSize: 14
  },
  onFocus: {
    backgroundColor: '#F2BE7D'
  },
  onBlure: {
    borderWidth: 1,
    borderColor: '#CCCCCC'
  }
})
