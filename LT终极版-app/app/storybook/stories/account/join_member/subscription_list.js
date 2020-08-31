import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import { inject } from 'mobx-react'
export default class SubscriptionList extends PureComponent {
  joinMember = id => {
    this.props.joinMember(id)
  }

  getSubscriptionItems = () => {
    const { currentSubscriptionTypeItems } = this.props
    let subscriptionItems = []
    currentSubscriptionTypeItems.map((item, index) => {
      subscriptionItems.push(
        <SubscriptionItem
          item={item}
          key={index}
          joinMember={this.joinMember}
        />
      )
    })
    return subscriptionItems
  }

  render() {
    return <View>{this.getSubscriptionItems()}</View>
  }
}

@inject('subscriptionStore')
class SubscriptionItem extends PureComponent {
  _joinMember = () => {
    const { joinMember, item } = this.props
    joinMember(item.id)
  }

  render() {
    const { item } = this.props
    const renew = item.extend_type === 'renew'
    return (
      <View style={styles.view}>
        <Text style={styles.subscriptionName}>{item.sub_display_name}</Text>
        <View style={styles.subscriptionTitleView}>
          <Text style={styles.subscriptionTitle}>
            {item.operation_plan ? item.operation_plan.name : ''}
          </Text>
          <Text style={styles.price}>￥{item.base_price}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            renew ? styles.renewButton : styles.upgradeButton
          ]}
          onPress={this._joinMember}>
          <Text
            style={[
              styles.buttonText,
              renew ? styles.renewButtonText : styles.upgradeButtonText
            ]}>
            {renew ? '立即续费' : '立即升级'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    marginLeft: 15,
    marginRight: 15,
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1
  },
  subscriptionName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '700'
  },
  subscriptionTitleView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: p2d(12),
    paddingRight: p2d(12),
    marginLeft: p2d(12)
  },
  subscriptionTitle: {
    fontSize: p2d(14) > 14 ? 14 : p2d(14),
    color: '#C8A052'
  },
  price: {
    fontSize: 14,
    color: '#EA5C39'
  },
  button: {
    width: p2d(72),
    height: p2d(26),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },
  buttonText: {
    fontSize: 13,
    color: '#C8A052',
    textAlign: 'center'
  },
  renewButton: {
    backgroundColor: '#EA5C39'
  },
  upgradeButton: {
    backgroundColor: '#333'
  },
  renewButtonText: {
    color: '#FFF'
  },
  upgradeButtonText: {
    color: '#C8A052'
  }
})
