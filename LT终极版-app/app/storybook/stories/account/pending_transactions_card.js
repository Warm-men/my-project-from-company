/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
export default class PendingTransactionsCard extends PureComponent {
  render() {
    const { currentCustomerStore } = this.props
    const { isSubscriber } = currentCustomerStore
    return (
      <View style={styles.container}>
        {isSubscriber ? (
          <View>
            <View style={styles.titleView}>
              <Text style={styles.chineseText}>会员特惠</Text>
              <Text style={styles.englishText}>PREFERENTIAL</Text>
              <TouchableOpacity style={styles.memberMore}>
                <Text style={styles.memberMoreText}>MORE</Text>
                <Icon name="ios-arrow-forward" size={14} color="#d7d7d7" />
              </TouchableOpacity>
            </View>
            <View style={styles.orderDetailView}>
              <Text>订单详情</Text>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.titlesView}>
              <Text style={styles.chineseText}>会员特惠</Text>
              <Text style={styles.englishText}>PREFERENTIAL</Text>
            </View>
            <View>
              <View style={styles.orderDetailView}>
                <Text>喜欢衣服，特惠留下</Text>
              </View>
              <View style={styles.moreView}>
                <TouchableOpacity>
                  <Text style={styles.moreText}>了解更多</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#f7f7f7',
    borderBottomWidth: 7,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15
  },
  titleView: {
    flexDirection: 'row'
  },
  titlesView: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingLeft: 20
  },
  normal: {
    paddingLeft: 10
  },
  chineseText: {
    fontWeight: '600',
    fontSize: 12,
    color: '#333',
    lineHeight: 12
  },
  englishText: {
    marginLeft: 10,
    paddingTop: 1,
    fontWeight: '400',
    fontSize: 10,
    color: '#666'
  },
  memberMore: {
    flexDirection: 'row',
    position: 'absolute',
    right: 0
  },
  memberMoreText: {
    fontWeight: '500',
    fontSize: 11,
    color: '#999',
    marginRight: 5
  },
  moreView: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  moreText: {
    fontSize: 15,
    width: 100,
    paddingTop: 8,
    paddingBottom: 8,
    textAlign: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 16,
    overflow: 'hidden',
    color: '#ddd'
  },
  orderDetailView: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
