import { QNetwork, SERVICE_TYPES } from '../services/services'
import Stores from '../../stores/stores'
import React from 'react'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import {
  View,
  Text,
  StyleSheet,
  DeviceEventEmitter,
  Platform
} from 'react-native'
let queryCount = 0
this.enable_payment_contract, this.subscription, this.free_service
//type 开通有问题页面传true 默认false
export const queryMePayContract = onSuccess => {
  showQueryDialog()
  queryCount = 0
  queryMeQuene(onSuccess)
}

const queryMeQuene = onSuccess => {
  queryCount++
  if (queryCount > 5) {
    Stores.modalStore.hide()
    errorDialog()
  } else {
    setTimeout(() => {
      QNetwork(
        SERVICE_TYPES.me.QUERY_ME_CONTRACT,
        {},
        response => {
          const {
            enable_payment_contract,
            subscription,
            free_service
          } = response.data.me
          if (enable_payment_contract && !!enable_payment_contract.length) {
            this.enable_payment_contract = enable_payment_contract
            this.subscription = subscription
            this.free_service = free_service
            queryChargeAfterEntrust(onSuccess)
          } else {
            queryMeQuene(onSuccess)
          }
        },
        () => {
          queryMeQuene(onSuccess)
        }
      )
    }, 1500)
  }
}

const queryChargeAfterEntrust = onSuccess => {
  setTimeout(() => {
    const id = Stores.subscriptionStore.charge_after_entrust_id
    QNetwork(
      SERVICE_TYPES.customerContract.CHARGE_AFTER_ENTRUST,
      { id },
      response => {
        const { state } = response.data.charge_after_entrust
        switch (state) {
          case 'charging': //签约成功，扣款中
            queryChargeAfterEntrust(onSuccess)
            break
          case 'complete': //签约成功且扣款成功
            Stores.modalStore.hide()
            onSuccess && onSuccess()
            contractSuccess(
              this.enable_payment_contract,
              this.subscription,
              this.free_service
            )
            break
          case 'charge_failed': //签约成功，扣款失败
            errorDialog()
            contractSuccess(
              this.enable_payment_contract,
              this.subscription,
              this.free_service
            )
            break
        }
      },
      () => {
        queryChargeAfterEntrust(onSuccess)
      }
    )
  }, 1500)
}

const errorDialog = () => {
  Stores.modalStore.show(
    <View style={styles.container}>
      <View style={styles.dialogView}>
        <Text style={styles.dialogText}>续费失败，请手动续费</Text>
      </View>
    </View>
  )
  DeviceEventEmitter.emit('onRefreshJoinMember', false)
  setTimeout(() => {
    Stores.modalStore.hide()
  }, 1500)
}
const showQueryDialog = () => {
  Stores.modalStore.show(
    <View style={[styles.container, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
      <View style={styles.dialogView}>
        <Text style={styles.dialogText}>正在处理续费</Text>
        <Spinner
          style={{ marginTop: Platform.OS === 'ios' ? -4 : 0 }}
          isVisible={true}
          size={13}
          type={'FadingCircleAlt'}
          color={'#FFFFFF'}
        />
      </View>
    </View>
  )
}
const contractSuccess = (enabledContract, subscription, free_service) => {
  Stores.currentCustomerStore.updateContract(enabledContract || [])
  if (subscription) {
    const { contract_display, subscription_type } = subscription
    Stores.currentCustomerStore.updateSubscriptionType(subscription_type)
    Stores.currentCustomerStore.updateContractDisplay(contract_display)
    Stores.currentCustomerStore.updateFreeService(free_service)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dialogView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#03050D',
    opacity: 0.8,
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  dialogText: {
    color: '#FFF',
    fontSize: 13,
    marginRight: 6
  }
})
