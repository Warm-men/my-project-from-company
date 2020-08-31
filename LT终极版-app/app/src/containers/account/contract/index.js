/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  AppState,
  Text,
  ActivityIndicator,
  DeviceEventEmitter
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
import { enableCustomerContract } from '../../../expand/tool/payment.js'
import { inject, observer } from 'mobx-react'
import { QNetwork, SERVICE_TYPES, GET } from '../../../expand/services/services'
import { CustomAlertView } from '../../../../storybook/stories/alert/custom_alert_view'
import { queryMeContract } from '../../../expand/tool/query_contract_helper.js'
import { ToastView } from '../../../../storybook/stories/alert/toast_view'
import {
  Contracted,
  OpenContract
} from '../../../../storybook/stories/account/contract'
import { abTrack } from '../../../components/ab_testing'
import Statistics from '../../../expand/tool/statistics'
import QuitAlert from '../../../../storybook/stories/alert/quit_alert'
let clickedWechatContract = false
@inject('currentCustomerStore', 'modalStore')
@observer
export default class ContractContainer extends Component {
  constructor(props) {
    super(props)
    this.queryed = false
    this.state = {
      contractTextData: null,
      isLoading: true,
      questionData: null
    }
  }
  componentDidMount() {
    abTrack('open_contract_page', 1)
    AppState.addEventListener('change', this._handleAppStateChange)
    this._getContractJson()
    this.alertData()
  }

  alertData = () => {
    GET(SERVICE_TYPES.questionnaire.FETCH_FREESERVICE_B, {}, response => {
      if (response) {
        this.setState({ questionData: response })
      }
    })
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
    AppState.removeEventListener('change', this._handleAppStateChange)
    this._checkoutPop()
  }
  _checkoutPop = () => {
    const { navigation, currentCustomerStore } = this.props
    const {
      inFirstMonthAndMonthlySubscriber,
      enablePaymentContract,
      freeService
    } = currentCustomerStore
    const openFreeService = navigation.state.params
      ? navigation.state.params.openFreeService
      : false
    if (
      openFreeService &&
      !enablePaymentContract.length &&
      freeService &&
      freeService.state !== 'active' &&
      freeService.state !== 'apply_refund' &&
      freeService.state !== 'approved' &&
      inFirstMonthAndMonthlySubscriber
    ) {
      this._showQuestionPop()
    }
  }

  _showQuestionPop = () => {
    const { modalStore } = this.props
    const { questionData } = this.state
    questionData &&
      modalStore.show(<QuitAlert hideChevronRight={true} data={questionData} />)
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }
  _alert = () => {
    const {
      currentCustomerStore: { enablePaymentContract, subscription },
      modalStore
    } = this.props
    const {
      auto_charge_management_page: { new_subscription_type },
      subscription_type: { preview }
    } = subscription
    if (!enablePaymentContract[0].can_disable) {
      modalStore.show(
        <CustomAlertView
          message="你手中有超过一个衣箱，请先送还，待仓库签收检验后，即可取消"
          other={[{ type: 'highLight', title: '好的' }]}
        />
      )
    } else {
      //新套餐且没有续费减免的情况下不弹信息
      if (new_subscription_type && !preview.auto_renew_discount) {
        this.openDisableContract()
        return
      }
      modalStore.show(
        <CustomAlertView
          messageComponent={this.getMessageComponent()}
          other={[
            {
              title: '取消免密支付',
              onClick: this.openDisableContract
            },
            {
              type: 'highLight',
              title: '继续享受特权'
            }
          ]}
        />
      )
    }
  }

  _getContractJson = () => {
    const { currentCustomerStore } = this.props
    const { auto_charge_management_page } = currentCustomerStore.subscription
    if (auto_charge_management_page) {
      const { configuration_file_url_v2 } = auto_charge_management_page
      if (configuration_file_url_v2) {
        GET(configuration_file_url_v2, {}, response => {
          this.getContarctStatus(response)
        })
      } else {
        // FIXME:  url 不存在处理
      }
    }
  }
  getMessageComponent = () => {
    return (
      <View style={styles.dialogContainer}>
        {this.state.contractTextData['dialogMessage'].map((item, index) => {
          return (
            <Text
              key={index}
              style={
                item.increasedBold ? styles.cancelTextWeight : styles.cancelText
              }>
              {item.text}
            </Text>
          )
        })}
      </View>
    )
  }
  openDisableContract = () => {
    const { navigation } = this.props
    navigation.navigate('DisableContract', {
      cancelContract: this.cancelContract
    })
  }
  showQueryDialog = () => {
    const { modalStore } = this.props
    modalStore.show(<ToastView message={'正在获取解约结果'} />, false)
  }
  cancelContract = error => {
    const { modalStore } = this.props
    if (error) {
      modalStore.show(
        <CustomAlertView
          message={error}
          other={[
            {
              title: '好的'
            }
          ]}
        />
      )
    } else {
      this.showQueryDialog()
      this.getContractDisplay()
    }
  }
  getContractDisplay = () => {
    this.timer = setTimeout(() => {
      const { currentCustomerStore, modalStore } = this.props
      QNetwork(SERVICE_TYPES.me.QUERY_ME_CONTRACT_DISPLAY, {}, response => {
        const { me } = response.data
        if (me) {
          const {
            subscription: {
              subscription_type,
              fast_shipping,
              contract_display
            },
            enable_payment_contract
          } = me
          currentCustomerStore.updateSubscriptionType(subscription_type)
          if (enable_payment_contract && enable_payment_contract.length > 0) {
            this.getContractDisplay()
          } else {
            //毫秒级小概率事件 me.enable_payment_contract 刷新的情况下 fast_shipping还没刷新
            if (fast_shipping.fast_shipping && !this.queryed) {
              this.getContractDisplay()
              this.queryed = true
              return
            }
            modalStore.hide()
            currentCustomerStore.updateContract([])
            currentCustomerStore.updateContractDisplay(contract_display)
            currentCustomerStore.updateFastShippingStatus({
              fast_shipping: fast_shipping.fast_shipping
            })
            DeviceEventEmitter.emit('onRefreshTotes')
            modalStore.show(
              <CustomAlertView
                title={'取消成功'}
                image={require('../../../../assets/images/account/contract_success.png')}
                message={'你已经成功取消免密支付功能，已不再享受优先发货特权!'}
                other={[
                  {
                    title: '好的',
                    type: 'highLight'
                  }
                ]}
              />
            )
          }
        }
      })
    }, 3000)
  }
  enableContract = () => {
    const { modalStore, currentCustomerStore, navigation } = this.props
    const openFreeService = navigation.state.params
      ? navigation.state.params.openFreeService
      : false
    if (currentCustomerStore.enablePaymentContract.length) {
      this._alert()
    } else {
      enableCustomerContract(openFreeService).then(result => {
        if (result === 'WeChat_GOBACK') {
          clickedWechatContract = true
        } else {
          modalStore.show(
            <CustomAlertView
              message={result.message}
              other={[
                {
                  title: '好的',
                  type: 'highLight',
                  onClick: () => {
                    queryMeContract(
                      this.contractSuccess,
                      navigation.navigate,
                      false,
                      openFreeService
                    )
                  }
                }
              ]}
            />
          )
        }
      })
    }
    Statistics.onEvent({
      id: 'freeservice_openfreesecret',
      label: '点击去开通免密'
    })
  }

  _handleAppStateChange = nextAppState => {
    const { navigation } = this.props
    const openFreeService = navigation.state.params
      ? navigation.state.params.openFreeService
      : false
    if (nextAppState === 'active' && clickedWechatContract) {
      clickedWechatContract = false
      queryMeContract(
        this.contractSuccess,
        navigation.navigate,
        false,
        openFreeService
      )
    }
  }
  contractSuccess = () => {
    const { navigation, modalStore } = this.props
    const openFreeService = navigation.state.params
      ? navigation.state.params.openFreeService
      : false

    if (openFreeService) {
      navigation.navigate('OpenFreeServiceSuccessful', { openFreeService })
    } else
      modalStore.show(
        <CustomAlertView
          title="开通成功"
          message="你已享受优先发货特权"
          image={require('../../../../assets/images/account/contract_success.png')}
          other={[
            {
              title: '好的',
              type: 'highLight'
            }
          ]}
        />
      )
    DeviceEventEmitter.emit('onRefreshTotes')
    DeviceEventEmitter.emit('onRefreshJoinMember')
  }

  //获取免密文案
  getContarctStatus = data => {
    QNetwork(SERVICE_TYPES.me.QUERY_ME_CONTRACT, {}, response => {
      const { currentCustomerStore } = this.props
      const { enable_payment_contract, subscription } = response.data.me
      const { auto_charge_management_page, subscription_type } = subscription
      //enable_payment_contract 判断是否签约
      currentCustomerStore.updateSubscriptionType(subscription_type)
      currentCustomerStore.updateContract(enable_payment_contract || [])
      currentCustomerStore.updateAutoChargeManagementPage(
        auto_charge_management_page
      )
      //是否是新套餐
      const contractTextData = auto_charge_management_page.new_subscription_type
        ? data['newSubscriptionType']
        : data['subscriptionType']
      this.setState({
        contractTextData,
        isLoading: false
      })
    })
  }

  openAgreement = () => {
    const { navigation } = this.props
    const { url, title } = this.state.contractTextData['agreement']
    navigation.navigate('WebPage', { uri: url, title, hideShareButton: true })
  }

  render() {
    const { enablePaymentContract } = this.props.currentCustomerStore
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'免密管理'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        {this.state.isLoading ? (
          <View>
            <ActivityIndicator animating={true} style={{ height: 80 }} />
          </View>
        ) : !!enablePaymentContract.length ? (
          <Contracted
            contractTextData={this.state.contractTextData}
            contractActiveWelfare={this.state.contractActiveWelfare}
            agreement={this.state.agreement}
            openAgreement={this.openAgreement}
            enableContract={this.enableContract}
          />
        ) : (
          <OpenContract
            contractTextData={this.state.contractTextData}
            openContractWelfare={this.state.openContractWelfare}
            agreement={this.state.agreement}
            openAgreement={this.openAgreement}
            enableContract={this.enableContract}
          />
        )}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  dialogContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    margin: 20,
    alignItems: 'center'
  },
  cancelText: {
    color: '#5E5E5E',
    fontSize: 14,
    lineHeight: 24
  },
  cancelTextWeight: {
    color: '#121212',
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '600'
  }
})
