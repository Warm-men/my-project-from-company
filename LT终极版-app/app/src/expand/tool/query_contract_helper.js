import { QNetwork, SERVICE_TYPES } from '../services/services'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
import Stores from '../../stores/stores'
import React from 'react'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { View, Text } from 'react-native'
let queryCount = 0
//type 开通有问题页面传true 默认false
export const queryMeContract = (
  onSuccess,
  navigate,
  type = false,
  openFreeService
) => {
  showQueryDialog()
  queryCount = 0
  queryMeQuene(onSuccess, navigate, type, openFreeService)
}

const queryMeQuene = (onSuccess, navigate, type = false, openFreeService) => {
  queryCount++
  if (queryCount > 3) {
    Stores.modalStore.hide()
    questionDialog(onSuccess, navigate, type, openFreeService)
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
            Stores.modalStore.hide()
            contractSuccess(
              enable_payment_contract,
              subscription,
              free_service,
              onSuccess
            )
          } else {
            queryMeQuene(onSuccess, navigate, type, openFreeService)
          }
        },
        () => {
          queryMeQuene(onSuccess, navigate, type, openFreeService)
        }
      )
    }, 1500)
  }
}
const questionDialog = (onSuccess, navigate, type, openFreeService) => {
  const openQuestion = () => {
    navigate('OpenQuestions', { openFreeService })
  }
  const queryMe = () => {
    showQueryDialog()
    queryCount = 0
    queryMeQuene(onSuccess, navigate, type)
  }
  Stores.modalStore.show(
    <CustomAlertView
      message={'是否开通成功?'}
      showCloseIcon={true}
      other={[
        {
          title: '开通有疑问',
          onClick: !type && openQuestion
        },
        {
          title: '开通成功',
          onClick: queryMe,
          type: 'highLight'
        }
      ]}
    />
  )
}
const showQueryDialog = () => {
  Stores.modalStore.show(
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 48,
          width: 162,
          backgroundColor: '#03050D',
          opacity: 0.8,
          borderRadius: 2,
          paddingHorizontal: 14
        }}>
        <Spinner
          isVisible={true}
          size={15}
          type={'FadingCircleAlt'}
          color={'#FFFFFF'}
        />
        <Text style={{ color: '#FFFFFF', fontSize: 14, marginLeft: 9 }}>
          正在获取签约结果
        </Text>
      </View>
    </View>
  )
}
const contractSuccess = (
  enabledContract,
  subscription,
  free_service,
  onSuccess
) => {
  Stores.currentCustomerStore.updateContract(enabledContract || [])
  if (subscription) {
    const { contract_display, subscription_type } = subscription
    Stores.currentCustomerStore.updateSubscriptionType(subscription_type)
    Stores.currentCustomerStore.updateContractDisplay(contract_display)
    Stores.currentCustomerStore.updateFreeService(free_service)
  }
  onSuccess && onSuccess(enabledContract)
}
