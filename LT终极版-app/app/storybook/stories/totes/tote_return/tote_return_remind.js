/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'

export default class ToteReturnRemind extends PureComponent {
  _getTextData = () => {
    const { type, isOnlyReturnToteFreeService } = this.props
    const autoPickupRemindTextContent = {
      title: '预约快递上门取件说明',
      content: [
        '1、预约归还无需快递费用，取件时间范围以页面显示为准',
        isOnlyReturnToteFreeService
          ? '2、顺丰小哥上门时请将保留有完整吊牌的衣服装进粉袋交给他即可，请注意不要遗漏自己的物品在衣服里'
          : '2、顺丰小哥上门时请将要归还的衣服和配饰装进袋子里交给他即可，请注意不要遗漏自己的物品在衣服里',
        '3、由于国家相关部门要求实施快递实名制，所以在顺丰小哥上门时可能需要登记身份证号码'
      ]
    }
    const selfDeliveryRemindTextContent = {
      title: '自行寄回说明',
      content: [
        '1、选择自寄后，可以自行联系顺丰或者使用丰巢智能柜寄回',
        '2、请寄回平台指定的地址并选择顺丰到付，暂不接受其他快递',
        '3、寄出后请务必输入顺丰单号，否则将被视为没有通过平台归还，产生20元/次的物流费用，并可能导致产生商品滞还金等费用'
      ]
    }
    let data =
      type === 'autoPickup'
        ? autoPickupRemindTextContent
        : selfDeliveryRemindTextContent

    return data
  }
  render() {
    const textData = this._getTextData()

    return (
      <View style={styles.remind}>
        <Text style={styles.remindTitle}>{textData.title}</Text>
        {textData.content.map((item, index) => {
          return (
            <Text key={index} style={styles.remindContent}>
              {item}
            </Text>
          )
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  remind: {
    margin: 15,
    paddingHorizontal: 8,
    paddingTop: 10
  },
  remindTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    paddingTop: 5,
    paddingBottom: 15
  },
  remindContent: {
    fontWeight: '400',
    fontSize: 13,
    color: '#999',
    lineHeight: 24
  }
})
