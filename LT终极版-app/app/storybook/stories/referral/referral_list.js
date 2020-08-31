/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { ReferralItem } from './'
export default class ReferralList extends PureComponent {
  render() {
    const { referrals } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <View style={styles.line} />
          <Text style={styles.title}>邀请进度</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.referralList}>
          {referrals.map((item, index) => {
            if (item.friend_subscription_started_on) {
              return <ReferralItem item={item} key={index} />
            }
          })}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  titleView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 15
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: '#E9E9E9'
  },
  title: {
    marginLeft: 15,
    marginRight: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '600'
  },
  referralList: {
    marginTop: 16,
    paddingLeft: 22,
    paddingRight: 22,
    marginBottom: 30
  }
})
