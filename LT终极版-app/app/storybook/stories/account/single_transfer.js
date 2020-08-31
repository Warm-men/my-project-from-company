import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../image'
import p2d from '../../../src/expand/tool/p2d'
import dateFns from 'date-fns'
export default class TransferView extends Component {
  subscriptionMigration = () => {
    const { subscriptionMigration, data } = this.props
    subscriptionMigration &&
      subscriptionMigration(data.target_subscription_type_id)
  }

  render() {
    const { data, customerService } = this.props
    const toteCapacity = `${data.clothing_count}+${data.accessory_count}`
    const time = dateFns.format(data.next_billing_at, 'YYYY.MM.DD')
    return (
      <View style={styles.container}>
        <Image
          style={styles.banner}
          source={require('../../../assets/images/account/transfer_banner.png')}
        />
        <View style={styles.cardView}>
          <ItemView
            type={'toteCapacity'}
            leftTitle={'衣箱容量'}
            rightTitle={toteCapacity}
          />
          <ItemView
            type={'toteCount'}
            leftTitle={'衣箱数量'}
            rightTitle={data.tote_count + '个'}
          />
          <ItemView
            type={'nextBillingAt'}
            leftTitle={'会员有效期'}
            rightTitle={time}
          />
          <TouchableOpacity
            testID="subscriptionMigration"
            style={[styles.buttonView, styles.redView]}
            onPress={this.subscriptionMigration}>
            <Text style={styles.redViewTitle}>立即升级</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonView, styles.whiteView]}
            onPress={customerService}>
            <Text style={styles.whiteViewTitle}>咨询客服</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export class ItemView extends Component {
  returnImage = () => {
    const { type } = this.props
    switch (type) {
      case 'toteCapacity':
        return require('../../../assets/images/account/transfer_capacity.png')
      case 'toteCount':
        return require('../../../assets/images/account/transfer_num.png')
      case 'nextBillingAt':
        return require('../../../assets/images/account/transfer_time.png')
    }
  }

  render() {
    const { leftTitle, rightTitle, type } = this.props
    const url = this.returnImage()
    return (
      <View style={styles.middeView}>
        <Image source={url} />
        <View style={styles.itemView}>
          <Text
            style={[
              styles.leftTitle,
              type === 'nextBillingAt' && { marginRight: p2d(21) }
            ]}>
            {leftTitle}
          </Text>
          <Text style={styles.rightTitle}>{rightTitle}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  banner: {
    width: p2d(375),
    height: p2d(185)
  },
  cardView: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f3f3',
    shadowColor: '#000',
    shadowOffset: { height: 6, width: 1 },
    shadowRadius: 4,
    shadowOpacity: 0.05,
    paddingTop: p2d(23),
    paddingLeft: p2d(30),
    width: p2d(315),
    paddingBottom: p2d(27),
    marginTop: p2d(-60)
  },
  middeView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: p2d(215),
    height: p2d(70),
    marginLeft: p2d(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f2f2f2'
  },
  leftTitle: {
    fontSize: 14,
    color: '#666',
    marginRight: p2d(36)
  },
  rightTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '700'
  },
  buttonView: {
    width: p2d(254),
    height: p2d(48),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6
  },
  redView: {
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 1,
    backgroundColor: '#e85c40',
    marginTop: p2d(26),
    marginBottom: p2d(15),
    shadowColor: 'rgba(232, 92, 64, 0.4)'
  },
  redViewTitle: {
    fontSize: 16,
    color: '#fff'
  },
  whiteView: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc'
  },
  whiteViewTitle: {
    fontSize: 15,
    color: '#000'
  }
})
