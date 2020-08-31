/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../image'
import p2d from '../../../../src/expand/tool/p2d'
import { endOfDay, differenceInDays, format } from 'date-fns'
import { inject, observer } from 'mobx-react'
@inject('currentCustomerStore')
@observer
export default class ReminderAfterToteSwapPoll extends PureComponent {
  renewSubscription = () => {
    const {
      subscription: { billing_date, totes_left },
      enablePaymentContract
    } = this.props.currentCustomerStore
    let message = null
    const billingDate = endOfDay(billing_date)
    const leftSubscriptionDays = differenceInDays(billingDate, new Date())

    if (!enablePaymentContract.length) {
      if (totes_left >= 1) {
        if (leftSubscriptionDays < 15) {
          return (message = (
            <Text testID="renewMessage1" style={styles.renewMessageText}>
              会员期剩
              <Text style={styles.lineHeightText}>{leftSubscriptionDays}</Text>
              天，衣箱数剩余
              <Text style={styles.lineHeightText}>{totes_left}个</Text>
              ，到期后未用完衣箱将被清零，续费可延长会员期
            </Text>
          ))
        }
      } else if (totes_left === 0) {
        if (leftSubscriptionDays < 8) {
          if (leftSubscriptionDays === 0) {
            return (message = (
              <Text testID="renewMessage2" style={styles.renewMessageText}>
                会员今天到期，到期后需立即归还衣箱，续费可延长会员期
              </Text>
            ))
          } else {
            return (message = (
              <Text testID="renewMessage3" style={styles.renewMessageText}>
                会员期剩
                <Text style={styles.lineHeightText}>
                  {leftSubscriptionDays}天
                </Text>
                ，衣箱数剩余
                <Text style={styles.lineHeightText}>{totes_left}个</Text>
                ，到期后需立即归还衣箱，续费可延长会员期
              </Text>
            ))
          }
        } else if (leftSubscriptionDays < 15) {
          return (message = (
            <Text testID="renewMessage4" style={styles.renewMessageText}>
              会员期剩
              <Text style={styles.lineHeightText}>
                {leftSubscriptionDays}天
              </Text>
              ，衣箱数剩余
              <Text style={styles.lineHeightText}>{totes_left}个</Text>
            </Text>
          ))
        }
      }
    }
    return message
  }

  referralBannerStyle = () => {
    const {
      referral_entry_banner_height,
      referral_entry_banner_width
    } = this.props.currentCustomerStore.referralBanner
    if (referral_entry_banner_height && referral_entry_banner_width) {
      let bannerwidth = p2d(335)
      let bannerHeight =
        (referral_entry_banner_height / referral_entry_banner_width) *
        bannerwidth
      return {
        width: bannerwidth,
        height: bannerHeight
      }
    } else {
      return null
    }
  }

  render() {
    const { renewMember, currentCustomerStore, referral } = this.props
    const {
      referralBanner,
      subscription: { billing_date, totes_left }
    } = currentCustomerStore
    const renewMessage = this.renewSubscription()
    const referralBannerStyle = referralBanner && this.referralBannerStyle()
    const billingDateText = format(billing_date, 'YYYY.M.DD')
    return (
      <View style={styles.container}>
        {renewMessage ? (
          <View>
            <View style={styles.renewMessageView}>{renewMessage}</View>
            <TouchableOpacity style={styles.buttonView} onPress={renewMember}>
              <Text style={styles.buttonText}>立即续费</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={[styles.renewMessageText, styles.fixMarginTop]}>
              会员期至
              <Text style={styles.lineHeightText}>{billingDateText}</Text>
              ，衣箱数剩余
              <Text style={styles.lineHeightText}>{totes_left}个</Text>
            </Text>
            {referralBanner &&
              referralBanner.referred_program_entry_banner_url && (
                <TouchableOpacity
                  testID="referralBanner"
                  style={styles.bannerView}
                  onPress={referral}>
                  <Image
                    style={referralBannerStyle}
                    source={{
                      uri: referralBanner.referred_program_entry_banner_url
                    }}
                  />
                </TouchableOpacity>
              )}
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonView: {
    width: 200,
    height: 44,
    backgroundColor: '#EA5C39',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    alignSelf: 'center'
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500'
  },
  renewMessageView: {
    width: 230,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 44
  },
  renewMessageText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#989898',
    letterSpacing: 0.4,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '300'
  },
  fixMarginTop: {
    marginTop: 12
  },
  bannerView: {
    marginTop: 54
  },
  lineHeightText: {
    color: '#F2A955',
    fontWeight: '500'
  }
})
