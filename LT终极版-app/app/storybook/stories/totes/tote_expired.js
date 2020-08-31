/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity
} from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import SubscriptionList from '../account/join_member/subscription_list'
export default class ToteExpired extends PureComponent {
  textReturn = () => {
    const {
      isFreeUser,
      promoCode,
      subscription,
      isOccasionUser,
      periodTote
    } = this.props
    if (isFreeUser) {
      if (promoCode === 'LTCN_FREE_TOTE' || promoCode === 'LTCN_FREE_TOTE_79') {
        return '7天体验会员已结束'
      }
    } else if (isOccasionUser) {
      return subscription.display_name + '已结束'
    } else if (periodTote && subscription.status === 'active') {
      return '会员期内已没有可用衣箱'
    } else {
      return '会员已过期'
    }
  }

  returnBanner = () => {
    const {
      isFreeUser,
      isOccasionUser,
      isNeedPayment,
      openPaymentPending,
      periodTote,
      subscription
    } = this.props
    if (isNeedPayment) {
      return (
        <View style={styles.container}>
          <Text style={styles.content}>你有待支付订单，请先处理</Text>
          <TouchableOpacity style={styles.button} onPress={openPaymentPending}>
            <Text style={styles.buttonText}>去付款</Text>
          </TouchableOpacity>
        </View>
      )
    }
    if (isFreeUser || isOccasionUser) {
      return (
        <Text style={styles.content2}>
          {`喜欢我们的服务吗\n请加入会员享受无限换穿吧`}
        </Text>
      )
    }
    if (periodTote && subscription.status === 'active') {
      return <Text style={styles.content2}>现在续费，剩余会员期可累积使用</Text>
    }
    return <Text style={styles.content}>我们准备了很多新服饰，等你回来哦</Text>
  }

  render() {
    const {
      joinMember,
      inCenter,
      currentSubscriptionTypeItems,
      summerPlan
    } = this.props
    const height = Dimensions.get('window').height
    return (
      <View
        style={[
          styles.container,
          inCenter
            ? {
                height: height - (summerPlan ? 200 : 60),
                justifyContent: 'center'
              }
            : {
                marginBottom: 20
              }
        ]}>
        <View style={styles.containerView}>
          <View style={styles.banner}>
            <Text style={styles.title}>{this.textReturn()}</Text>
            {this.returnBanner()}
          </View>
          <SubscriptionList
            joinMember={joinMember}
            currentSubscriptionTypeItems={currentSubscriptionTypeItems}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  banner: {
    alignItems: 'center',
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1
  },
  containerView: {
    elevation: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    backgroundColor: '#FFF',
    width: p2d(345),
    paddingTop: p2d(22)
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
    color: '#333'
  },
  content: {
    fontWeight: '400',
    fontSize: 12,
    color: '#999',
    lineHeight: 38
  },
  content2: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 12,
    color: '#999',
    lineHeight: 20,
    padding: 15
  },
  button: {
    width: p2d(224),
    height: p2d(40),
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    borderRadius: 2
  },
  buttonText: {
    fontSize: 14,
    color: '#FFF'
  }
})
