/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Image from '../image'

export default class ReferralPurchaseCredit extends PureComponent {
  render() {
    const { purchaseCredit, referrals } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <SubTitle title={'邀请流程'} />
          <Image
            style={styles.flowPath}
            source={require('../../../assets/images/account/flow_path.png')}
            resizeMode="cover"
          />
        </View>
        <SubTitle title={'已获得奖励金'} />
        {!!referrals.length ? (
          <View style={styles.contentView}>
            <Text style={styles.creditValue}>￥{purchaseCredit}</Text>
          </View>
        ) : (
          <View style={styles.container}>
            <Text style={styles.subContentTextLine1}>
              奖励金可用于续费或购买服饰，可累计使用
            </Text>
            <Text style={styles.subContentTextLine2}>
              还没有获得奖励，赶快邀请好友加入会员吧
            </Text>
          </View>
        )}
      </View>
    )
  }
}

class SubTitle extends PureComponent {
  render() {
    return (
      <View style={styles.titleView}>
        <View style={styles.line} />
        <Text style={styles.title}>{this.props.title}</Text>
        <View style={styles.line} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%'
  },
  contentView: {
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 20
  },
  titleView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: '#E9E9E9'
  },
  title: {
    marginHorizontal: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '600'
  },
  creditTitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: '400'
  },
  creditValue: {
    fontSize: 25,
    color: '#333',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center'
  },
  unit: {
    fontSize: 15
  },
  flowPath: {
    marginTop: 16,
    marginBottom: 40
  },
  subContentTextLine1: { fontSize: 12, color: '#999', marginVertical: 12 },
  subContentTextLine2: {
    fontSize: 14,
    color: '#333',
    marginBottom: 40
  }
})
