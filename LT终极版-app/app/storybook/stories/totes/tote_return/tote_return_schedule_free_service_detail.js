/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'

const freeServiceAllLeft = {
  title: '你已选择：全部留下',
  content: [
    '1. 期间仍可变更选择，仓库将以实际寄回的的衣位数为准',
    '2. 自在选租赁金50元/衣位，全部留下需100元',
    '3. 如果产生租赁金会在7天内给你发送费用通知',
    '4、如果要归还，请保留完整吊牌并装入粉袋'
  ]
}
const freeServiceAllReturn = {
  title: '你已选择：我要归还',
  content: [
    '1. 期间仍可变更选择，仓库将以实际寄回的的衣位数为准',
    '2. 自在选租赁金50元/衣位，全部留下需100元',
    '3. 如果产生租赁金会在7天内给你发送费用通知',
    '4、如果要归还，请保留完整吊牌并装入粉袋'
  ]
}
export default class ToteReturnScheduleFreeServiceDetails extends PureComponent {
  render() {
    const { return_slot_count } = this.props.toteFreeService
    const renderData =
      return_slot_count === 0 ? freeServiceAllLeft : freeServiceAllReturn
    return (
      <View style={styles.container}>
        <View style={styles.subTitleVeiw}>
          <Text style={styles.subTitleText}>{'新衣箱自在选'}</Text>
        </View>
        <View style={styles.returnTypeVeiw}>
          <Text style={styles.returnText}>{renderData.title}</Text>
          {renderData.content.map((item, index) => {
            return (
              <Text style={styles.text} key={index}>
                {item}
              </Text>
            )
          })}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 8,
    paddingHorizontal: p2d(16)
  },
  subTitleVeiw: {
    marginTop: p2d(32)
  },
  subTitleText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  returnTypeVeiw: {
    marginTop: 25
  },
  returnText: {
    fontSize: 14,
    color: '#5E5E5E',
    marginBottom: 12
  },
  text: {
    fontSize: 13,
    color: '#999',
    lineHeight: 24
  }
})
