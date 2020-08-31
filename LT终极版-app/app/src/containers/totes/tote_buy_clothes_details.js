import React, { PureComponent } from 'react'
import { View, StyleSheet, ScrollView, Text, FlatList } from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import Image from '../../../storybook/stories/image'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import p2d from '../../expand/tool/p2d'
import PaymentConstants from '../../expand/tool/payment_constanst'
import ToteBuyPromoCode from '../../../storybook/stories/totes/tote_buy_promo_code'
import SelectProductItem from '../../../storybook/stories/totes/tote_buy_clothes/select_product_item'
import dateFns from 'date-fns'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services'
export default class ToteBuyClothesDetailsContainer extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      lineItems: [],
      summary: { discount: null, purchase_credit: null, total_amount: null },
      paidAt: null,
      payment: null,
      isLoading: true
    }
  }

  componentDidMount() {
    this._queryProductsOrder()
  }

  _queryProductsOrder = () => {
    const { order } = this.props.navigation.state.params
    QNetwork(
      SERVICE_TYPES.totes.QUERY_ORDER,
      { id: order.id },
      response => {
        const { order } = response.data
        if (order) {
          this.setState({
            lineItems: order.line_items,
            summary: order.summary,
            paidAt: order.paid_at,
            payment: order.payment,
            isLoading: false
          })
        }
      },
      () => {
        this.setState({ isLoading: false })
      }
    )
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _keyExtractor = (item, index) => index.toString()

  selectProductItem = ({ item }) => {
    const { amount, product, size } = item
    const photo = product.catalogue_photos[0]
    const photoUrl = photo
      ? photo.thumb_url
        ? photo.thumb_url
        : photo.full_url
      : ''
    return (
      <SelectProductItem
        toteProduct={item}
        photoUrl={photoUrl}
        size={size.abbreviation}
        modifiedPrice={amount}
      />
    )
  }

  listFooterComponent = () => {
    const { lineItems } = this.state
    let price = 0
    lineItems.map(item => {
      price = price + item.amount
    })

    return (
      <View style={styles.listFooterComponent}>
        <Text style={styles.listFooterComponentLeftText}>商品小计</Text>
        <Text style={styles.listFooterComponentRightText}>¥{price}</Text>
      </View>
    )
  }

  returnGateway = () => {
    let uri = null,
      name = null
    const { payment, summary } = this.state
    if (payment && payment.gateway) {
      const gateway = payment.gateway

      if (gateway.indexOf('alipay') !== -1) {
        uri = PaymentConstants.icon.ALIPAY
        name = '支付宝支付'
      }
      if (gateway.indexOf('jd_pay') !== -1 && summary.total_amount <= 2000) {
        uri = PaymentConstants.icon.JDPAY
        name = '京东支付'
      }
      if (gateway.indexOf('wechat') !== -1) {
        uri = PaymentConstants.icon.WECHAT
        name = '微信支付'
      }
    }

    return { uri, name }
  }

  render() {
    const { summary, lineItems, paidAt, isLoading } = this.state
    const discountTotal = summary.discount + summary.purchase_credit
    const { uri, name } = this.returnGateway()
    let time = dateFns.format(paidAt, 'YYYY.MM.DD HH:mm')
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          title={'支付详情'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView>
          {isLoading ? (
            <View style={styles.emptyView}>
              <Spinner
                isVisible={true}
                size={40}
                type={'Pulse'}
                color={'#222'}
              />
            </View>
          ) : (
            <View style={styles.container}>
              <FlatList
                style={styles.selectProductlist}
                scrollEnabled={false}
                data={lineItems}
                keyExtractor={this._keyExtractor}
                renderItem={this.selectProductItem}
                ListFooterComponent={this.listFooterComponent}
              />
              <View style={styles.priceContainerView}>
                <ToteBuyPromoCode
                  isPayEnd={true}
                  discount={summary.discount}
                  promoCodesNum={0}
                />
                {summary && summary.purchase_credit > 0 && (
                  <View style={styles.specificPriceView}>
                    <Text style={styles.hui14}>奖励金</Text>
                    <Text style={styles.hei14}>
                      -¥{summary.purchase_credit}
                    </Text>
                  </View>
                )}
                <View style={styles.specificPriceView}>
                  <Text style={styles.hui14}>优惠合计</Text>
                  <Text style={styles.hei14}>-¥{discountTotal}</Text>
                </View>
              </View>

              <View style={styles.priceContainerView}>
                <View style={styles.payModeView}>
                  <Text style={styles.hui14}>实付</Text>
                  <Text style={styles.red14}>¥{summary.total_amount}</Text>
                </View>
                {!!uri && !!name && (
                  <View style={styles.payModeView}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text style={styles.hui14}>支付方式</Text>
                    </View>
                    <View style={styles.wechatPayView}>
                      <Image
                        style={styles.wechatPayIcon}
                        source={uri}
                        resizeMode="contain"
                      />
                      <Text style={styles.wechatPayText}>{name}</Text>
                    </View>
                  </View>
                )}
                <View style={styles.payModeView}>
                  <Text style={styles.hui14}>支付时间</Text>
                  <Text style={styles.hei14}>{time}</Text>
                </View>
              </View>

              <View style={styles.tipsView}>
                <Text style={[styles.hei14, styles.tipsName]}>购买说明</Text>
                <View style={styles.tipsContainerView}>
                  <Text style={styles.tipsText}>
                    1、购买成功后将此商品留下，其余商品随衣箱归还 {'\n'}
                    2、本平台所有商品皆为特殊商品，购买后不支持退换
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7'
  },
  priceContainerView: {
    backgroundColor: 'white',
    marginTop: 7,
    paddingLeft: 16,
    paddingRight: 16
  },
  hei14: {
    fontSize: 14,
    color: '#333'
  },
  hui14: {
    fontSize: 14,
    color: '#666'
  },
  red14: {
    fontSize: 14,
    color: '#EA5C39'
  },
  specificPriceView: {
    flexDirection: 'row',
    paddingVertical: 16,
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F2F2F2'
  },
  PriceView: {
    paddingVertical: 16,
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  payModeView: {
    paddingVertical: 16,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    borderBottomColor: '#F3F3F3',
    borderBottomWidth: 1
  },
  wechatPayView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  wechatPayIcon: {
    height: 20,
    width: 20
  },
  wechatPayText: {
    marginLeft: 10,
    fontSize: 12,
    color: '#666'
  },
  tipsView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 7,
    paddingTop: 16
  },
  tipsName: {
    marginBottom: 16,
    alignSelf: 'flex-start',
    marginLeft: 16
  },
  tipsContainerView: {
    width: p2d(345),
    backgroundColor: '#F2F2F5',
    padding: 15,
    marginBottom: 16
  },
  tipsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 22
  },
  payView: {
    width: '100%',
    position: 'absolute',
    zIndex: 1
  },
  listHeaderComponent: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2'
  },
  listHeaderComponentText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    marginTop: 16
  },
  listFooterComponent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15
  },
  listFooterComponentLeftText: {
    color: '#5e5e5e',
    fontSize: 14
  },
  listFooterComponentRightText: {
    fontSize: 14,
    color: '#333'
  },
  selectProductlist: {
    paddingHorizontal: 12,
    backgroundColor: '#fff'
  },
  emptyView: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
