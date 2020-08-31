/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'

export default class PlansAgreement extends PureComponent {
  openAgreement = () => {
    this.props.navigation.push('WebPage', {
      uri: 'https://wechat.letote.cn/agreement',
      title: '托特衣箱用户服务协议',
      hideShareButton: true
    })
  }
  render() {
    return (
      <View style={styles.agreementView}>
        <Icon name={'info'} size={14} color="#ddd" style={{ marginTop: 3 }} />
        <Text style={styles.agreementMessage}>
          本服务不支持退款，购买即视为同意
          <Text onPress={this.openAgreement} style={styles.agreementButton}>
            《用户服务协议》
          </Text>
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  agreementView: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 10,
    backgroundColor: '#F7F7F7'
  },
  agreementMessage: {
    fontSize: 12,
    marginLeft: 6,
    color: '#C4C4C4',
    lineHeight: 16
  },
  agreementButton: { color: '#2A2A2A', lineHeight: 16 }
})
