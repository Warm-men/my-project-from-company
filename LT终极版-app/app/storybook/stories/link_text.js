/* @flow */

import React, { Component } from 'react'
import { StyleSheet, Linking } from 'react-native'
import ParsedText from 'react-native-parsed-text'
export default class LinkText extends Component {
  handlePhonePress(phone) {
    Linking.openURL('tel:' + phone)
  }
  render() {
    const { textStyle, openWebPage } = this.props
    return (
      <ParsedText
        {...this.props}
        parse={[
          {
            type: 'phone',
            style: textStyle || styles.phone,
            onPress: this.handlePhonePress
          },
          {
            pattern: /《用户服务协议》/,
            style: textStyle || styles.phone,
            onPress: openWebPage
          }
        ]}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  phone: {
    color: '#5299f8'
  }
})
