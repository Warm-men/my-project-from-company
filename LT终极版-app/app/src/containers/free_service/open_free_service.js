import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { Experiment, Variant } from '../../../src/components/ab_testing'
import { getFreeServicePrice } from '../../../src/request'
import { updateFreeService } from '../../expand/tool/free_service'
import { inject, observer } from 'mobx-react'
import {
  Mutate,
  SERVICE_TYPES,
  QNetwork,
  GET
} from '../../expand/services/services'
import OpenFreeService from '../../../storybook/stories/free_service/open_free_service'
import OpenFreeServiceExperiment from '../../../storybook/stories/free_service/open_free_service_experiment'
import Statistics from '../../expand/tool/statistics'
import QuitAlert from '../../../storybook/stories/alert/quit_alert'
import p2d from '../../expand/tool/p2d'
@inject('currentCustomerStore', 'appStore', 'modalStore')
@observer
export default class OpenFreeServiceContainer extends Component {
  constructor(props) {
    super(props)
    this.getPurchaseId()
    this.showAlert = true
    this.state = { questionData: null }
  }

  componentDidMount() {
    updateFreeService()
    this.updateFreePassword()
    this._getData()
  }

  componentWillUnmount() {
    this._checkoutPop()
  }

  _getData = () => {
    GET(SERVICE_TYPES.questionnaire.FETCH_FREESERVICE_A, {}, response => {
      if (response) {
        this.setState({ questionData: response })
      }
    })
  }
  _checkoutPop = () => {
    const {
      inFirstMonthAndMonthlySubscriber,
      enablePaymentContract,
      freeService
    } = this.props.currentCustomerStore
    if (
      !enablePaymentContract.length &&
      freeService &&
      freeService.state !== 'active' &&
      freeService.state !== 'apply_refund' &&
      freeService.state !== 'approved' &&
      inFirstMonthAndMonthlySubscriber &&
      this.showAlert
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
  updateFreePassword = () => {
    QNetwork(SERVICE_TYPES.me.QUERY_ME_CONTRACT, {}, response => {
      const { currentCustomerStore } = this.props
      const { enable_payment_contract } = response.data.me
      currentCustomerStore.updateContract(enable_payment_contract || [])
    })
  }

  openFreeServiceClick = () => {
    const { enablePaymentContract } = this.props.currentCustomerStore
    const isContarcted = !!enablePaymentContract.length
    if (!isContarcted) {
      this.props.navigation.navigate('Contract', { openFreeService: true })
      this.showAlert = false
    } else {
      this.openFreeService()
    }
    Statistics.onEvent({
      id: 'freeservice_freeopening',
      label: '点击免费开通自在选'
    })
  }
  getPurchaseId = () => {
    getFreeServicePrice().then(response => {
      const { free_service_types } = response.data
      if (free_service_types && free_service_types.length > 0)
        free_service_types.map(result => {
          if (result.type === 'FreeServiceContractType') {
            this.id = result.id
          }
        })
    })
  }
  openFreeService = () => {
    if (this.id) {
      Mutate(
        SERVICE_TYPES.freeService.PURCHASE_FREE_SERVICE,
        {
          purchaseFreeServiceInput: {
            payment_method_id: -2,
            free_service_type_id: this.id
          }
        },
        response => {
          if (response.data.PurchaseFreeService.order.successful) {
            updateFreeService()
            this.props.navigation.replace('OpenFreeServiceSuccessful')
          } else {
            this.props.appStore.showToast(result.errors[0].message, 'error')
          }
        },
        error => {
          console.log(error)
        }
      )
    } else {
      this.getPurchaseId()
    }
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }
  openFreeServiceHelp = () => {
    this.props.navigation.navigate('FreeServiceHelp')
  }
  openClothesCleanFlow = () => {
    this.props.navigation.navigate('WebPage', {
      uri: 'https://static.letote.cn/free_service/clothes_clean_flow/index.html'
    })
  }

  render() {
    const { enablePaymentContract } = this.props.currentCustomerStore
    const isContarcted = !!enablePaymentContract.length
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'自在选'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <Experiment defaultValue={1} flagName={'new_open_free_service'}>
          <Variant value={1}>
            <OpenFreeService
              isContarcted={isContarcted}
              openFreeService={this.openFreeServiceClick}
              openFreeServiceHelp={this.openFreeServiceHelp}
              openClothesCleanFlow={this.openClothesCleanFlow}
            />
          </Variant>
          <Variant value={2} style={styles.container}>
            <OpenFreeServiceExperiment
              isContarcted={isContarcted}
              openFreeService={this.openFreeServiceClick}
              openFreeServiceHelp={this.openFreeServiceHelp}
            />
          </Variant>
        </Experiment>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 }
})
