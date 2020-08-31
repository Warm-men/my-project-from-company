/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Image from '../../image'

export default class ToteReturndSelfDeliveryFcAddressCard extends PureComponent {
  render() {
    // TODO FCAddress should be fcAddress, getContent should be copyContent
    const { fcAddress, copyContent } = this.props
    return (
      <View style={styles.FCWrapView}>
        <Text style={styles.inputTitle}>{'寄回地址'}</Text>
        <View style={styles.FCView}>
          <Text style={styles.FCAddressText}>{fcAddress}</Text>
          <TouchableOpacity
            style={styles.copyButton}
            activeOpacity={0.6}
            hitSlop={{ top: 10, left: 20, right: 20, bottom: 10 }}
            onPress={copyContent}>
            <Text style={styles.copyText}>{'复制'}</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={require('../../../../assets/images/totes/address_line.png')}
          style={styles.lineImage}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  FCWrapView: {
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 7,
    marginTop: 23
  },
  inputTitle: {
    marginLeft: 24,
    fontSize: 16,
    color: '#333',
    fontWeight: '600'
  },
  FCView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 8
  },
  FCAddressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginRight: 20,
    flex: 1
  },
  copyButton: {
    width: 47,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 3
  },
  copyText: {
    fontSize: 13,
    color: '#666666'
  },
  lineImage: {
    marginTop: 24,
    marginHorizontal: 4
  }
})
