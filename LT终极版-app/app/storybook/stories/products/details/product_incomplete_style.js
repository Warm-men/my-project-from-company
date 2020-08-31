/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { inject } from 'mobx-react'

export default class ProductIncompleteStyleView extends PureComponent {
  render() {
    const { pushToStyle } = this.props
    return <Original pushToStyle={pushToStyle} />
  }
}

// 纯文本版本
@inject('currentCustomerStore')
class Original extends PureComponent {
  render() {
    const { currentCustomerStore, pushToStyle } = this.props
    const { firstDeliveredTote } = currentCustomerStore
    return (
      <TouchableOpacity
        style={styles.originalView}
        disabled={!firstDeliveredTote}
        onPress={firstDeliveredTote ? pushToStyle : null}>
        <Image
          style={styles.roleImage}
          source={require('../../../../assets/images/product_detail/role_icon.png')}
        />
        {firstDeliveredTote ? (
          <View style={styles.originalContentView}>
            <Text style={styles.defaultText}>
              {'合身穿搭须从量体开始，'}
              <Text style={styles.redText}>{'立即使用卷尺测量吧 '}</Text>
              <Icon style={styles.redText} size={12} name="ios-arrow-forward" />
            </Text>
          </View>
        ) : (
          <Text style={styles.defaultText}>
            会员首个衣箱会赠送卷尺，请及时测量个人身材数据，智能尺码推荐才会更精准。
          </Text>
        )}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  original: { alignItems: 'center', flexDirection: 'row', paddingBottom: 20 },
  originalText: { paddingLeft: 10, fontSize: 12, color: '#E85C40' },
  roleImage: { marginTop: 4, marginRight: 4 },
  originalView: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 24,
    backgroundColor: '#fff5f4',
    borderRadius: 2
  },
  originalContentView: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  defaultText: {
    paddingLeft: 4,
    fontSize: 12,
    color: '#5E5E5E',
    lineHeight: 20,
    flex: 1
  },
  redText: { color: '#E85C40' }
})
