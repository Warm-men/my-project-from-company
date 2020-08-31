import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
export default class NextToteValidaor extends Component {
  render() {
    const {
      message,
      buttonText,
      buttonStyle,
      textStyle,
      isShowSchedule,
      uiScreenHeight
    } = this.props
    return (
      <View
        style={[
          styles.container,
          !isShowSchedule && { marginTop: uiScreenHeight - 120 }
        ]}>
        <Text style={styles.bannerText}>{'新衣箱暂时不能开启'}</Text>
        <Text style={styles.containerText}>{message}</Text>
        <TouchableOpacity
          style={[styles.button, buttonStyle && buttonStyle]}
          onPress={this.props.openPaymentPending}>
          <Text style={[styles.buttonText, textStyle]}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
    alignItems: 'center',
    marginBottom: 40
  },
  bannerText: {
    fontSize: 18,
    color: '#333'
  },
  containerText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#999',
    width: 260,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 224,
    height: 40
  },
  buttonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '700'
  }
})
