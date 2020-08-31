/* @flow */

import React, { Component } from 'react'
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import p2d from '../../../src/expand/tool/p2d'
import { getCustomerName } from '../../../src/expand/tool/userInfo_inspect'

export default class UserProfileCard extends Component {
  getStatusMessage = () => {
    const { isValidSubscriber, subscriptionDate, subscription } = this.props
    if (!subscription) return ''

    let text = ''
    const {
      billing_date_extending,
      status,
      remain_additional_days,
      promo_code,
      subscription_type,
      display_name
    } = subscription

    if (billing_date_extending) {
      if (status !== 'on_hold') {
        text = `会员期从首个衣箱寄出或${remain_additional_days}天后开始计算`
      }
      return text
    }
    if (isValidSubscriber || status === 'active') {
      text = `会员有效期至${subscriptionDate}`
    } else {
      if (status === 'cancelled') {
        if (
          promo_code === 'LTCN_FREE_TOTE' ||
          promo_code === 'LTCN_FREE_TOTE_79'
        ) {
          text = '7天体验会员已结束'
        } else if (subscription_type && subscription_type.occasion) {
          text = display_name + '已结束'
        } else {
          text = '会员已过期'
        }
      }
    }
    return text
  }

  suspendText = () => {
    const { subscription } = this.props
    let text = null
    if (subscription && subscription.status === 'on_hold') {
      text = '会员已暂停'
    } else if (subscription && subscription.status === 'pending_hold') {
      text = '已申请暂停'
    }
    return text
  }

  render() {
    const {
      avatarUrl,
      id,
      isSubscriber,
      signInCustomer,
      openUserProfile,
      testID,
      subscription,
      joinMember,
      nickname,
      telephone,
      isStylist
    } = this.props
    const statusMessage = this.getStatusMessage()
    const suspendText = this.suspendText()
    const displayInterval =
      subscription && !!subscription.display_interval
        ? subscription.display_interval
        : ''

    const name = getCustomerName(nickname, telephone)
    const showToteLeft =
      subscription &&
      subscription.totes_left !== null &&
      subscription.totes_left >= 0
    const showRenewButton = subscription && !subscription.billing_date_extending
    return (
      <View style={styles.view} testID={testID}>
        <Image
          style={styles.backgroundImage}
          resizeMode="cover"
          source={require('../../../assets/images/account/group_card.png')}
        />
        <View style={styles.cardView}>
          {id ? (
            <View>
              <TouchableOpacity
                style={styles.signInWrapView}
                onPress={openUserProfile}>
                <View>
                  <Image
                    style={styles.avatar}
                    resizeMode="cover"
                    source={
                      !!avatarUrl
                        ? { uri: avatarUrl }
                        : require('../../../assets/images/account/square_customer_avatar.png')
                    }
                  />
                  {isStylist && (
                    <Image
                      style={styles.stylistIcon}
                      source={require('../../../assets/images/customer_photos/stylist_tip.png')}
                    />
                  )}
                </View>
                <View
                  style={isSubscriber ? styles.subscriber : styles.signInView}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.customerNameText,
                      isStylist && { color: '#E8A056' }
                    ]}>
                    {name}
                  </Text>
                  {isSubscriber ? (
                    <View>
                      <View style={styles.middleView}>
                        <Text style={styles.memberSign}>
                          {subscription.display_name + ' ' + displayInterval}
                        </Text>
                      </View>
                      {showToteLeft && (
                        <Text style={styles.surplusTitle}>
                          当前剩余{subscription.totes_left}个衣箱
                        </Text>
                      )}
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[styles.button]}
                      onPress={joinMember}>
                      <Text style={styles.signInText}>加入会员</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.signIconView}>
                  <Text style={styles.suspendText}>{suspendText}</Text>
                  <Icon
                    name="ios-arrow-forward"
                    size={20}
                    color="#D7D7D7"
                    style={styles.signIcon}
                  />
                </View>
              </TouchableOpacity>
              {(showRenewButton || statusMessage !== '') && (
                <View style={styles.termOfValidity}>
                  <Text style={styles.termOfValidityText}>{statusMessage}</Text>
                  {showRenewButton && (
                    <TouchableOpacity
                      style={styles.renewButton}
                      onPress={joinMember}>
                      <Text style={styles.renewText}>立即续费</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.signInWrapView}>
              <Image
                style={styles.avatar}
                resizeMode="cover"
                source={require('../../../assets/images/account/square_customer_avatar.png')}
              />
              <View style={styles.signInView}>
                <Text style={styles.customerNameText}>SIGN IN</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={signInCustomer}>
                  <Text style={styles.signInText}>立即登入</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    paddingBottom: 24,
    backgroundColor: '#FFF'
  },
  backgroundImage: {
    width: '100%',
    height: p2d(160)
  },
  middleView: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  cardView: {
    backgroundColor: '#FFF',
    marginTop: -p2d(100),
    marginLeft: p2d(20),
    marginRight: p2d(20),
    width: p2d(335),
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'rgb(204,204,204)',
    shadowOpacity: 0.4,
    shadowRadius: 6
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginTop: 18,
    marginBottom: 24
  },
  nameplateView: {
    width: p2d(27),
    height: p2d(14),
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: p2d(4),
    borderRadius: 2
  },
  nameplateText: {
    fontSize: 9,
    color: '#FFF'
  },
  termOfValidity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    paddingLeft: 15,
    paddingRight: 15
  },
  termOfValidityText: {
    fontSize: 13,
    color: '#333'
  },
  renewButton: {
    width: p2d(72),
    height: p2d(26),
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },
  renewText: {
    fontSize: 13,
    color: '#fff'
  },

  memberSign: {
    fontWeight: '400',
    fontSize: 12,
    color: '#333',
    letterSpacing: 0.75
  },
  signInWrapView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15
  },
  signInView: {
    height: 60,
    paddingLeft: 16,
    flex: 1,
    justifyContent: 'space-between'
  },
  subscriber: {
    height: 65,
    paddingLeft: 16,
    justifyContent: 'space-around',
    flex: 1
  },
  customerNameText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333'
  },
  button: {
    width: p2d(135),
    backgroundColor: '#EA5C39',
    height: p2d(29),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2
  },
  signInText: {
    color: '#ffffff',
    fontSize: 14
  },
  suspendText: {
    fontSize: 12,
    color: '#999'
  },
  signIconView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  signIcon: {
    marginLeft: 6
  },
  surplusTitle: {
    fontSize: 12,
    color: '#333',
    marginTop: p2d(8)
  },
  stylistIcon: {
    position: 'absolute',
    right: 0,
    bottom: 24,
    width: 24,
    height: 24
  }
})
