import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import {
  Mutate,
  SERVICE_TYPES,
  QNetwork
} from '../../expand/services/services.js'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import RedeemInput from '../../../storybook/stories/redeem/redeem_input'
import ExchangeComplete from '../../../storybook/stories/redeem/exchange_complete'
import { inject, observer } from 'mobx-react'

@inject('appStore', 'currentCustomerStore', 'toteCartStore')
@observer
class RedeemContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: null,
      result: null,
      promoCode: null,
      errors: null,
      exchangeName: null
    }
  }

  resetResult = () => {
    if (this.state.exchangeName) {
      this._goBack()
    } else {
      this.setState({ result: null, code: null })
    }
  }

  goCoupon = () => {
    const { promoCode } = this.state
    const { currentCustomerStore } = this.props
    let ids = null
    if (promoCode.subscription_type_ids) {
      ids = promoCode.subscription_type_ids
    } else {
      if (currentCustomerStore.subscription) {
        ids = [currentCustomerStore.subscription.subscription_type.id]
      }
    }
    this.props.navigation.popToTop()
    this.props.navigation.navigate('JoinMember', { nowCoupon: promoCode, ids })
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }
  _onChangeText = code => {
    this.setState({ code })
  }
  _regCode = () => {
    const reg = /^[0-9a-zA-Z]+$/
    const regCode = reg.test(this.state.code)
    return regCode
  }
  _comfirm = () => {
    if (this.isLoading) {
      return
    }
    const { appStore } = this.props
    if (!this.state.code) {
      appStore.showToast('请输入兑换码', 'error')
      return
    }
    const regCode = this._regCode()
    if (!regCode) {
      appStore.showToast('请输入正确的兑换码', 'error')
      return
    }
    this.isLoading = true
    const input = {
      code: this.state.code,
      payment_method_id: -1,
      raise_redeem_error: false
    }
    Mutate(
      SERVICE_TYPES.redeem.MUTATION_REDEEM_YOUZAN_CODE,
      { input },
      response => {
        const {
          success,
          promo_code,
          exchange_name,
          errors
        } = response.data.RedeemYouzanCode
        if (success) {
          this.setState({
            result: true,
            promoCode: promo_code,
            exchangeName: exchange_name
          })
        } else {
          if (exchange_name) {
            appStore.showToast(errors[0], 'error')
          } else {
            this.setState({ errors, promoCode: promo_code, result: false })
          }
        }
        this._getCurrentCustomer()
      },
      error => {
        appStore.showToast(error, 'error')
        this.isLoading = false
      }
    )
  }

  _getCurrentCustomer = () => {
    const { currentCustomerStore, appStore, toteCartStore } = this.props
    QNetwork(
      SERVICE_TYPES.me.QUERY_ME,
      {},
      response => {
        const me = response.data.me
        if (me) {
          currentCustomerStore.updateCurrentCustomer(me)
          toteCartStore.updateToteCart(me.tote_cart)
          this.isLoading = false
        }
      },
      error => {
        this.isLoading = false
        appStore.showToast(error, 'error')
      }
    )
  }

  render() {
    const { result, errors, promoCode, exchangeName } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={result === null ? '会员卡兑换' : '兑换结果'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
          hasBottomLine={false}
        />
        {result === null ? (
          <RedeemInput
            navigation={this.props.navigation}
            onChangeText={this._onChangeText}
            code={this.state.code}
            comfirm={this._comfirm}
          />
        ) : (
          <ExchangeComplete
            isSuccessed={result}
            errors={errors}
            promoCode={promoCode}
            exchangeName={exchangeName}
            resetResult={this.resetResult}
            goCoupon={this.goCoupon}
          />
        )}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default RedeemContainer
