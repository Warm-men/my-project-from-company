/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  DeviceEventEmitter
} from 'react-native'

import { Mutate, SERVICE_TYPES, QNetwork } from '../../expand/services/services'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import Image from '../../../storybook/stories/image'

import Udesk from '../../expand/tool/udesk'
import { inject } from 'mobx-react'
import { PenddingSuccess } from '../../../storybook/stories/plans'
import TransferView from '../../../storybook/stories/account/single_transfer'
import MultipleTransferView from '../../../storybook/stories/account/multiple_transfer'
import ErrorView from '../../../storybook/stories/account/transfer_error'
@inject(
  'currentCustomerStore',
  'appStore',
  'modalStore',
  'toteCartStore',
  'couponStore'
)
export default class TransferMemberContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toteCapacity: null,
      toteCount: null,
      nextBillingAt: null,
      loadingModalVisible: true,
      success: null,
      availableMigrateOptions: [],
      errors: []
    }
    this.isPaymentSucceed = false
  }

  componentDidMount() {
    this.getSubscriptionMigrationPreview()
  }

  finishMigration = () => {
    this.getCurrentCustomer()
    this.props.modalStore.hide()
    DeviceEventEmitter.emit('onRefreshTotes')
    this.setState({
      success: true
    })
  }

  getSubscriptionMigrationPreview = () => {
    QNetwork(
      SERVICE_TYPES.common.QUERY_SUBSCRIPTION_MIGRATION_PREVIEW,
      {},
      response => {
        const { subscription_migration_preview } = response.data
        if (subscription_migration_preview) {
          const {
            errors,
            available_migrate_options
          } = subscription_migration_preview
          this.setState({
            errors,
            availableMigrateOptions: available_migrate_options,
            loadingModalVisible: false,
            success: !!!errors.length ? null : false
          })
        }
      },
      () => {
        this.setState({
          loadingModalVisible: false,
          success: false
        })
      }
    )
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _joinMember = () => {
    this.props.navigation.navigate('JoinMember', { successRoute: 'Account' })
  }

  _customerService = () => {
    const { currentCustomerStore, appStore } = this.props
    let customer = {}
    if (currentCustomerStore.id) {
      customer.nickname = currentCustomerStore.nickname
      customer.id = currentCustomerStore.id
    } else {
      customer.nick_name = ''
      customer.id = appStore.getGUID()
    }
    Udesk.updateCustomer(customer)
    Udesk.entryChat()
  }

  _subscriptionMigration = subscriptionTypeId => {
    const { appStore, modalStore } = this.props
    modalStore.show(
      <PenddingSuccess
        finishPayment={this.finishMigration}
        checkStatus={() => {
          return this.isPaymentSucceed
        }}
      />
    )
    let input = {
      subscription_type_id: subscriptionTypeId
    }
    Mutate(
      SERVICE_TYPES.common.MUTATION_SUBSCRIPTION_MIGRATION,
      { input },
      () => {
        this.isPaymentSucceed = true
      },
      error => {
        modalStore.hide()
        appStore.showToast(error, 'error')
      }
    )
  }

  getCurrentCustomer = () => {
    const { toteCartStore, currentCustomerStore, couponStore } = this.props
    QNetwork(SERVICE_TYPES.me.QUERY_ME, {}, response => {
      const { me } = response.data
      if (me) {
        currentCustomerStore.updateCurrentCustomer(me)
        toteCartStore.updateToteCart(me.tote_cart)
        couponStore.updateValidCoupons(me)
      }
    })
  }

  goBackHome = () => {
    this.props.navigation.popToTop()
  }

  render() {
    const {
      success,
      loadingModalVisible,
      availableMigrateOptions,
      errors
    } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          hasBottomLine={false}
          title={'会员升级'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        {loadingModalVisible ? (
          <View testID="loading-modal" style={styles.loadingModal}>
            <ActivityIndicator animating={true} style={{ height: 80 }} />
          </View>
        ) : (
          <View style={styles.container}>
            {success === null ? (
              <View>
                {availableMigrateOptions.length > 1 ? (
                  <MultipleTransferView
                    testID="multiple-transfer"
                    data={availableMigrateOptions}
                    subscriptionMigration={this._subscriptionMigration}
                    customerService={this._customerService}
                  />
                ) : (
                  <TransferView
                    testID="transfer"
                    data={availableMigrateOptions[0]}
                    subscriptionMigration={this._subscriptionMigration}
                    customerService={this._customerService}
                  />
                )}
              </View>
            ) : (
              <View>
                {success ? (
                  <SuccessView
                    testID="transfer-success"
                    goBackHome={this.goBackHome}
                  />
                ) : (
                  <ErrorView
                    testID="transfer-error"
                    customerService={this._customerService}
                    joinMember={this._joinMember}
                    error={errors[0]}
                  />
                )}
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    )
  }
}

export class SuccessView extends Component {
  render() {
    return (
      <View style={styles.successView}>
        <Image
          style={styles.successImage}
          source={require('../../../assets/images/me_style/pay_success.png')}
        />
        <Text style={styles.successText}>升级成功</Text>
        <TouchableOpacity
          style={[styles.successButton, styles.contactButton]}
          onPress={this.props.goBackHome}>
          <Text style={styles.successButtonText}>返回首页</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  successView: {
    marginTop: 100,
    alignItems: 'center',
    flex: 1
  },
  successImage: {
    width: 76,
    height: 76
  },
  successText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    fontWeight: '700',
    lineHeight: 30
  },
  contactButton: {
    width: 164,
    height: 48,
    borderWidth: 1,
    borderColor: '#B2B2AF',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  successButton: {
    marginTop: 39
  },
  successButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '800'
  }
})
