import React, { Component, PureComponent } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import Image from '../../image'
import p2d from '../../../../src/expand/tool/p2d'
export default class BonusHeader extends Component {
  render() {
    const { referralAmount, currentCustomerStore, goReferral } = this.props
    const { balance, enablePaymentContract } = currentCustomerStore
    const isContarcted = enablePaymentContract && !!enablePaymentContract.length
    return (
      <View style={styles.warpper}>
        <View style={styles.cardContainer}>
          <Image
            style={styles.imageCard}
            source={require('../../../../assets/images/account/credit/credit_account.png')}
          />
          <View>
            <Text style={styles.balanceTitle}>{'余额(元)'}</Text>
            <Text testID={'balance'} style={styles.balanceDescript}>
              {balance}
            </Text>
          </View>
          <View style={styles.contractContainer}>
            <View style={styles.creditContractContainer}>
              {isContarcted && (
                <Image
                  style={styles.creditContract}
                  source={require('../../../../assets/images/account/credit/credit_contract.png')}
                />
              )}
              <Text testID={'contract'} style={styles.contract}>
                {isContarcted ? '已开通免密支付' : ''}
              </Text>
            </View>
            {balance < 0 ? (
              <TouchableOpacity
                testID={'refund'}
                style={styles.refund}
                onPress={this.props.popUpPanelOnShow}>
                <Text style={styles.refundText}>立即还款</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        {referralAmount !== undefined && referralAmount !== null && (
          <ReferralBar
            referralAmount={referralAmount}
            goReferral={goReferral}
          />
        )}
        <View style={styles.accountDetail}>
          <Text style={styles.accountDetails}>账户明细</Text>
        </View>
      </View>
    )
  }
}
class ReferralBar extends PureComponent {
  render() {
    return (
      <View style={styles.referralBar}>
        <Text style={styles.creditDescript}>
          你通过邀请好友累积获得
          <Text style={styles.bonusText}>{this.props.referralAmount}元</Text>
          奖励金，继续邀请获得更多
        </Text>
        <TouchableOpacity
          onPress={this.props.goReferral}
          style={styles.referral}>
          <Text style={styles.referralText}>邀请好友</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  warpper: {
    marginTop: p2d(12),
    paddingHorizontal: 20
  },
  cardContainer: {
    height: 134,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  imageCard: {
    width: '100%',
    height: 134,
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 8
  },
  creditContract: { height: 14, width: 14, marginRight: 6 },
  creditContractContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  balanceTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 19,
    marginTop: 33,
    marginLeft: 20
  },
  balanceDescript: {
    marginLeft: 20,
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: '600'
  },
  referralBar: {
    flexDirection: 'row',
    marginTop: 30,
    backgroundColor: '#FBFBFB',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4
  },
  contractContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 34,
    marginRight: 16,
    marginBottom: 37
  },
  contract: {
    fontSize: 12,
    color: '#F3AD9F'
  },
  refund: {
    borderColor: '#F2BE7D',
    width: 80,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2BE7D',
    borderRadius: 2
  },
  refundText: { color: '#FFFFFF', fontSize: 13 },
  creditDescript: {
    flex: 1,
    paddingRight: 10,
    lineHeight: 22,
    fontSize: 14,
    color: '#242424'
  },
  referral: {
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    borderWidth: 1
  },
  referralText: {
    color: '#5E5E5E',
    fontSize: 13
  },
  accountDetails: {
    marginHorizontal: 10,
    fontWeight: '600',
    fontSize: 16,
    color: '#242424',
    marginTop: 29
  },
  accountDetail: {
    borderBottomColor: '#f3f3f3',
    borderBottomWidth: 1,
    paddingBottom: 14
  },
  bonusText: {
    fontSize: 14,
    color: '#F2BE7D'
  }
})
