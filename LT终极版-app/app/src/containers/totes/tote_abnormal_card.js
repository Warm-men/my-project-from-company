/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { inject, observer } from 'mobx-react'
import {
  QNetwork,
  SERVICE_TYPES,
  Mutate
} from '../../expand/services/services.js'
import {
  CreditAccountBar,
  ToteCommonAbnormalCard
} from '../../../storybook/stories/totes/tote_top_card'
import dateFns from 'date-fns'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
import { abTrack } from '../../components/ab_testing/index.js'
@inject('currentCustomerStore', 'modalStore', 'appStore')
@observer
export default class ToteAbnormalCard extends Component {
  constructor(props) {
    super(props)
    this.state = { toteStateTips: null }
    this.isLoading = false
  }

  componentDidMount() {
    const { finishedRefreshing } = this.props
    this._getToteAbnormalData(finishedRefreshing)
  }

  _checkErrors = data => {
    let hasErrors = false
    if (data) {
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          const item = data[key]
          if (item && item.errors) {
            if (!hasErrors && item.errors.length) {
              hasErrors = true
            }
          }
        }
      }
    }
    return hasErrors
  }

  _getToteAbnormalData = callback => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    QNetwork(
      SERVICE_TYPES.totes.QUERY_TOTE_STATE_TIPS,
      {},
      response => {
        const { tote_state_tips } = response.data
        const hasErrors = this._checkErrors(tote_state_tips)
        const isNeedPayment = this._isNeedPayment(tote_state_tips)
        callback && callback(hasErrors, isNeedPayment)
        this.isLoading = false
        this.setState({ toteStateTips: hasErrors ? tote_state_tips : null })
      },
      () => {
        const hasErrors = this._checkErrors(this.state.tote_state_tips)
        const isNeedPayment = this._isNeedPayment(this.state.tote_state_tips)
        callback && callback(hasErrors, isNeedPayment)
        this.isLoading = false
      }
    )
  }

  _handleToteAbnormalCard = error_code => {
    switch (error_code) {
      case 'errors_need_payment':
        this._openPaymentPendding()
        break
      case 'errors_subscription_disabled':
        this._handleSubscriptionError()
        break
      case 'errors_subscription_on_hold':
        this._reactivateSubscriptionAlert()
        break
      case 'errors_tote_left_zero':
        this._handleSubscriptionError()
        break
      case 'errors_first_tote_gift':
        this._handleFirstToteGift()
        break
      case 'errors_without_wechat_contract':
        this._handleContract()
        break
      case 'return_prev_tote_with_free_service':
      case 'urgently_return_prev_tote_with_free_service':
      case 'return_prev_tote':
      case 'urgently_return_prev_tote':
        this.props.returnPreTote()
        break
      default:
        return
    }
  }

  // 判断当前是否有待付款
  _isNeedPayment = data => {
    let bool = false
    if (data) {
      const { credit_account_validation, transaction_validation } = data
      if (!credit_account_validation.success) {
        bool = true
      } else if (!transaction_validation.success) {
        const { errors } = transaction_validation
        if (errors.length && errors[0].error_code === 'errors_need_payment') {
          bool = true
        }
      }
    }
    return bool
  }

  _handleContract = () => {
    this.props.navigation.navigate('Contract')
  }

  _linkToToteFreeServiceHelp = () => {
    this.props.navigation.navigate('FreeServiceHelp')
  }

  _handleFirstToteGift = () => {
    const { navigation, currentCustomerStore } = this.props
    const hasCompleteSizes = currentCustomerStore.hasCompleteSizes()
    if (hasCompleteSizes) {
      navigation.navigate('OnlyStyle', {
        confirm: true
      })
    } else {
      navigation.navigate('StyleAndSize')
    }
    abTrack('role_card_click', 1)
  }

  _handleSubscriptionError = () => {
    this.props.navigation.navigate('JoinMember')
  }

  _openPaymentPendding = () => {
    this.props.navigation.navigate('PaymentPending')
  }

  _reactivateSubscriptionAlert = () => {
    this.props.modalStore.show(
      <CustomAlertView
        message={'会员期将从今天开始恢复计算，确定要提前恢复会员吗'}
        cancel={{ title: '取消', type: 'normal' }}
        other={[
          {
            title: '确定',
            type: 'highLight',
            onClick: this._reactivateSubscription
          }
        ]}
      />
    )
  }

  _reactivateSubscription = () => {
    const { currentCustomerStore, onRefresh, appStore } = this.props
    Mutate(SERVICE_TYPES.me.MUTATION_REACTIVATE_SUBSCRIPTION, {}, response => {
      const {
        hold_date,
        billing_date
      } = response.data.ReactivateSubscription.subscription
      let time = dateFns.format(billing_date, 'YYYY年MM月DD日')
      currentCustomerStore.subscriptionDate = time
      currentCustomerStore.subscription.billing_date = billing_date
      currentCustomerStore.subscription.hold_date = hold_date
      onRefresh && onRefresh()
      appStore.showToastWithOpacity('恢复会员成功')
    })
  }

  _handleCreditErrors = () => {
    // errors_need_recharge_account
    this.props.navigation.navigate('CreditAccount')
  }

  render() {
    const { toteStateTips } = this.state
    const { currentCustomerStore } = this.props
    if (!toteStateTips) {
      return null
    }
    const {
      credit_account_validation,
      transaction_validation,
      subscription_validation,
      extra_validation,
      tote_return_validation
    } = toteStateTips
    return (
      <View style={styles.container}>
        {!credit_account_validation.success && (
          <CreditAccountBar
            message={credit_account_validation.errors[0].message}
            onClick={this._handleCreditErrors}
            buttonText={'去处理'}
          />
        )}
        {!transaction_validation.success && (
          <ToteCommonAbnormalCard
            testID="tansaction-validation-card"
            errors={transaction_validation.errors[0]}
            onClick={this._handleToteAbnormalCard}
          />
        )}
        {!subscription_validation.success && (
          <ToteCommonAbnormalCard
            testID="subscription-validation-card"
            errors={subscription_validation.errors[0]}
            onClick={this._handleToteAbnormalCard}
            subscription={currentCustomerStore.subscription}
          />
        )}
        {!extra_validation.success && (
          <ToteCommonAbnormalCard
            testID="extra-validation-card"
            errors={extra_validation.errors[0]}
            onClick={this._handleToteAbnormalCard}
          />
        )}
        {!tote_return_validation.success && (
          <ToteCommonAbnormalCard
            testID="tot-return-validation-card"
            errors={tote_return_validation.errors[0]}
            onClick={this._handleToteAbnormalCard}
            linkToToteFreeServiceHelp={this._linkToToteFreeServiceHelp}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
