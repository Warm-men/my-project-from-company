import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import UserProfileItem from '../../../../storybook/stories/account/user_profile_item'
import { observer, inject } from 'mobx-react'
import dateFns from 'date-fns'

@inject('currentCustomerStore', 'modalStore')
@observer
export default class Contracted extends Component {
  formatDate = subscription => {
    let date = dateFns.format(
      dateFns.addDays(
        new Date(subscription.billing_date),
        subscription.auto_charge_management_page.new_subscription_type ? -2 : 1
      ),
      'YYYY.MM.DD'
    )
    return date
  }
  render() {
    const {
      openAgreement,
      enableContract,
      currentCustomerStore: { subscription },
      contractTextData
    } = this.props
    const {
      base_price,
      interval,
      preview: { auto_renew_discount }
    } = subscription.subscription_type
    const contractActiveWelfare = !!auto_renew_discount
      ? contractTextData.contractActiveWelfare
      : contractTextData.contractActiveWithNoReductionWelfare
    //续费价格 套餐价 - 配置的自动续费优惠 除以分月
    const price = (base_price - auto_renew_discount) / (interval || 1)
    return (
      <View style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
        <View style={styles.topView}>
          <Text style={styles.descrip}>{'已开通免密支付'}</Text>
          <TouchableOpacity style={styles.touchView} onPress={enableContract}>
            <Text style={styles.open}>{'取消'}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: '#F7F7F7',
            backgroundColor: 'white'
          }}>
          <View style={styles.successView}>
            <View style={styles.infoText}>
              <Text style={styles.textExplain}>{'每次续费金额'}</Text>
              <Text style={styles.monthPrice}>
                {price}
                <Text style={styles.month}>/月</Text>
              </Text>
            </View>
            <View style={styles.infoText}>
              <Text style={styles.textExplain}>{'支付方式'}</Text>
              <Text style={styles.textValue}>{'微信免密支付'}</Text>
            </View>
            <View style={styles.infoText}>
              <Text style={styles.textExplain}>{'预计续费时间'}</Text>
              <Text style={styles.textValue}>
                {this.formatDate(subscription)}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginBottom: 20,
              marginLeft: 20
            }}>
            <View style={styles.warningView} />
            {/* 三角形 */}
            <View style={styles.warning}>
              <Text style={styles.warningText}>
                {'*如有优惠券和奖励金将会自动抵扣'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.descriptionView}>
          <Text style={styles.descriptionTitle}>{'自动续费福利'}</Text>
          {contractActiveWelfare &&
            contractActiveWelfare.map((item, index) => {
              return (
                <Text key={index} style={styles.descriptionItem}>
                  {item.map((content, itemIndex) => {
                    return (
                      <Text
                        key={itemIndex}
                        style={
                          content.increasedBold
                            ? styles.firstText
                            : styles.descriptionItem
                        }>
                        {content.text}
                      </Text>
                    )
                  })}
                </Text>
              )
            })}
        </View>
        {contractTextData['agreement'] && (
          <UserProfileItem
            onPress={openAgreement}
            titleStyle={styles.roleTitle}
            style={styles.roleView}
            leftStr={'免密支付服务协议'}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topView: {
    backgroundColor: 'white',
    borderTopWidth: 12,
    borderTopColor: '#F7F7F7',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 16,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  descrip: {
    color: '#242424',
    fontSize: 16,
    fontWeight: '600'
  },
  touchView: {
    borderWidth: 1,
    borderColor: '#E85C40',
    borderRadius: 2,
    width: 80,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  open: {
    fontSize: 14,
    color: '#E85C40'
  },
  successView: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20
  },

  textExplain: { color: '#989898', fontSize: 12 },
  infoText: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  textValue: {
    color: '#242424',
    fontSize: 12,
    marginTop: 10
  },
  warningView: {
    width: '100%',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderColor: 'transparent',
    borderBottomColor: '#F3F3F3',
    marginLeft: 50,
    marginTop: 15
  },
  warning: {
    marginLeft: 10,
    backgroundColor: '#F3F3F3',
    height: 34,
    width: 195,
    justifyContent: 'center',
    alignItems: 'center'
  },
  warningText: {
    fontSize: 12,
    color: '#242424'
  },
  descriptionTitle: {
    color: '#242424',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 4,
    paddingBottom: 12
  },
  descriptionView: {
    borderTopWidth: 12,
    borderTopColor: '#F3F3F3',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white'
  },
  descriptionItem: {
    fontSize: 14,
    color: '#5E5E5E',
    lineHeight: 26
  },
  roleView: {
    borderTopWidth: 12,
    borderTopColor: '#F7F7F7',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: 'white'
  },
  roleTitle: {
    fontSize: 14,
    color: '#242424'
  },
  month: {
    color: '#121212',
    fontSize: 12,
    marginTop: 10
  },
  monthPrice: {
    color: '#242424',
    fontSize: 14,
    marginTop: 10
  },
  firstText: {
    color: '#121212',
    fontSize: 14,
    fontWeight: '600'
  }
})
