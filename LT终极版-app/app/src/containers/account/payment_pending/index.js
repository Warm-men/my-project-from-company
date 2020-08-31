/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Text } from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
import { inject } from 'mobx-react'
import PaymentPendingCard from '../../../../storybook/stories/account/payment_pending'
import Image from '../../../../storybook/stories/image'
import { QNetwork, SERVICE_TYPES } from '../../../expand/services/services'
import { Column } from '../../../expand/tool/add_to_closet_status'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import PopUpPanel from '../../../components/pop_up_panel'
import PayType from '../../../../storybook/stories/account/join_member/pay_type_view'
import { updateBalance } from '../../../expand/tool/balance'
const DEFAULT_PAYMENT_METHOD = 'wechat_native'
@inject('ordersStore', 'currentCustomerStore')
export default class PaymentPendingContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: 0,
      loading: true,
      orders: [],
      pupVisible: false
    }
    this.paymentMethod = DEFAULT_PAYMENT_METHOD
    this.getOrdersList()
  }

  getOrdersList = () => {
    this.getOrders(data => {
      this.setState({
        loading: false,
        amount: data.me.available_purchase_credit.amount,
        orders: data.orders
      })
    })
  }

  queryPaymentResult = onResult => {
    this.getOrders(data => {
      onResult && onResult(data)
      if (this.state.amount !== data.me.available_purchase_credit.amount) {
        this.setState({
          loading: false,
          amount: data.me.available_purchase_credit.amount
        })
      } else {
        this.setState({ loading: false })
      }
    })
  }
  paySuccess = data => {
    this.props.ordersStore.orders = data.orders
    updateBalance()
  }

  getOrders = onSuccess => {
    QNetwork(
      SERVICE_TYPES.orders.QUERY_ORDERS,
      {},
      response => {
        this.props.ordersStore.orders = response.data.orders
          ? [...response.data.orders]
          : []
        onSuccess && onSuccess(response.data)
      },
      () => {
        this.setState({ loading: false })
      }
    )
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  onPressProduct = item => {
    const column = Column.PaymentPending
    this.props.navigation.navigate('Details', { item, column })
  }

  _popUpPanelOnClose = () => {
    this.setState({ pupVisible: false })
  }
  _popUpPanelOnShow = () => {
    if (!this.price) {
      this.pay()
    } else {
      this.setState({ pupVisible: true })
    }
  }
  _popPanelHide = () => {
    this._popUpPanel._onHide()
  }
  preparePayment = (payment, price) => {
    this.payment = payment
    this.price = price
  }
  _changeType = paymentMethod => {
    this.paymentMethod = paymentMethod
  }
  pay = () => {
    this.payment(this.paymentMethod)
  }
  render() {
    const isFirstLoading = this.state.loading && this.state.orders.length === 0
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          hasBottomLine={false}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <View
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.container}>
          <Text style={styles.title}>待付款</Text>
          {isFirstLoading ? (
            <View style={styles.loadingView}>
              <Spinner
                isVisible={true}
                size={30}
                type={'Pulse'}
                color={'#222'}
              />
            </View>
          ) : this.state.orders.length === 0 ? (
            <View style={styles.container}>
              <View style={styles.noPendingPaymentContainer}>
                <Image
                  style={styles.noPendingPayment}
                  source={require('../../../../assets/images/account/no_pending_payment.png')}
                />
                <Text style={styles.textNoPendingPayment}>暂无待付款信息</Text>
                <Text style={styles.textDescription}>
                  {`衣箱签收后你可直接购买心仪的服饰\n或在归还衣箱时，留下喜欢的服饰，我\n们收到后会给你生成待付款订单，你只\n需按照提示完成支付即可`}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.orderView}>
              <ScrollView
                style={styles.scroll}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                {this.state.orders.map((item, index) => {
                  return (
                    <PaymentPendingCard
                      paymentMethod={this.paymentMethod}
                      showPannel={this._popUpPanelOnShow}
                      preparePayment={this.preparePayment}
                      key={index + ''}
                      style={styles.paymentPendingCard}
                      onPressProduct={this.onPressProduct}
                      queryResult={this.queryPaymentResult}
                      paySuccess={this.paySuccess}
                      navigation={this.props.navigation}
                      {...item}
                    />
                  )
                })}
                <View style={styles.remind}>
                  <Text style={styles.remindTitle}>付款说明</Text>
                  <Text style={styles.remindContent}>
                    1、待付款商品为特殊商品，购买后不支持退换
                  </Text>
                  <Text style={styles.remindContent}>
                    2、请在规定时间内完成支付，否则将会产生商品滞还金
                  </Text>
                  <Text style={styles.remindContent}>
                    3、如果由于忘记归还或遗漏商品而产生订单，请尽快归还或联系在线客服进行处理
                  </Text>
                </View>
              </ScrollView>
            </View>
          )}
        </View>
        <PopUpPanel
          ref={popUpPanel => (this._popUpPanel = popUpPanel)}
          onClose={this._popUpPanelOnClose}
          visible={this.state.pupVisible}
          height={330}>
          <PayType
            type={this.paymentMethod}
            changeType={this._changeType}
            price={this.price}
            pay={this.pay}
            onHide={this._popPanelHide}
          />
        </PopUpPanel>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  orderView: { flex: 1 },
  scroll: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
    marginHorizontal: 20,
    marginVertical: 20
  },
  title: {
    marginTop: 25,
    marginLeft: 20,
    fontSize: 24,
    color: '#333333',
    fontWeight: '600'
  },
  prompt: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 14,
    color: '#999999',
    marginBottom: 20
  },
  noPendingPayment: {
    width: 106,
    height: 90
  },
  textNoPendingPayment: {
    marginTop: 24,
    fontWeight: '500',
    fontSize: 16,
    color: '#242424',
    lineHeight: 20
  },
  textDescription: {
    marginTop: 10,
    fontSize: 12,
    color: '#989898',
    textAlign: 'center',
    lineHeight: 20
  },
  noPendingPaymentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -85
  },
  paymentPendingCard: {
    marginTop: 20
  },
  remind: {
    backgroundColor: '#F2F2F5',
    marginTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 15
  },
  remindTitle: {
    fontWeight: '400',
    fontSize: 14,
    color: '#333',
    paddingTop: 5,
    paddingBottom: 15
  },
  remindContent: {
    fontWeight: '400',
    fontSize: 12,
    color: '#666666',
    lineHeight: 22
  },
  phoneColor: {
    color: '#E85C40'
  },
  loadingView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  }
})
