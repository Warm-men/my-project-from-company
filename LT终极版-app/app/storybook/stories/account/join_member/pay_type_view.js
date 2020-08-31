import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList
} from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import Image from '../../image'
import PaymentConstants from '../../../../src/expand/tool/payment_constanst'

export default class PaymentTypesView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { type: props.type }
    this.paymentTypesArray = this._getPaymentTypesArray()
  }

  _getPaymentTypesArray = () => {
    const { price } = this.props
    const paymentTypesArray = [
      {
        id: 'wechat_native',
        title: '微信支付',
        description: null,
        icon: require('../../../../assets/images/account/wechatpay.png')
      },
      {
        id: 'alipay_native',
        title: '支付宝支付',
        description: null,
        icon: require('../../../../assets/images/account/alipay.png')
      },
      price <= 2000
        ? {
            id: 'jd_pay_native',
            title: '京东支付',
            description: null,
            icon: require('../../../../assets/images/account/jdpay.png')
          }
        : {
            id: 'hide_jd_pay_native'
          }
    ]
    return paymentTypesArray
  }
  _didSelectedPaymentType = type => {
    const { changeType } = this.props
    this.setState({ type })
    changeType && changeType(type)
  }

  _confirmToPay = () => {
    const { pay, onHide } = this.props
    pay && pay()
    onHide && onHide()
  }

  _extractUniqueKey(item) {
    return item.id
  }

  _renderItem = ({ item }) => {
    if (item.id === 'hide_jd_pay_native') return null
    const isSelected = this.state.type === item.id
    return (
      <PaymentType
        item={item}
        isSelected={isSelected}
        didSelectedItem={this._didSelectedPaymentType}
      />
    )
  }

  render() {
    const { price, isContract } = this.props
    const showContract =
      isContract &&
      price <= 499 &&
      this.state.type === PaymentConstants.type.WECHAT_NATIVE
    return (
      <View style={styles.mainView}>
        <Text style={styles.title}>请选择支付方式</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          keyExtractor={this._extractUniqueKey}
          data={this.paymentTypesArray}
          extraData={this.state.type}
          renderItem={this._renderItem}
        />
        <TouchableOpacity
          style={styles.buttonView}
          onPress={this._confirmToPay}>
          <Text style={styles.buttonText}>
            {showContract ? '免密支付 ' : '确认支付 '} ￥{price}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class PaymentType extends PureComponent {
  _didSelectedItem = () => {
    const { didSelectedItem, item, isSelected } = this.props
    !isSelected && didSelectedItem && didSelectedItem(item.id)
  }
  render() {
    const { isSelected, item } = this.props
    const { icon, title, description } = item
    return (
      <TouchableOpacity
        style={styles.payTypeView}
        onPress={this._didSelectedItem}>
        <View style={styles.leftView}>
          <Image source={icon} />
          <Text style={styles.leftTitle}>
            {title}
            {!!description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </Text>
        </View>
        <Image
          style={styles.iconStyle}
          source={
            isSelected
              ? require('../../../../assets/images/me_style/focus_button.png')
              : require('../../../../assets/images/me_style/blur_button.png')
          }
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  mainView: {
    paddingTop: 20,
    alignItems: 'center'
  },
  title: {
    color: '#333',
    paddingBottom: 23
  },
  payTypeView: {
    width: p2d(335),
    marginTop: 19,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 19,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    flex: 1
  },
  leftView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 16
  },
  leftTitle: {
    fontSize: 14,
    color: '#999',
    marginLeft: 10
  },
  description: {
    fontSize: 12,
    color: '#E8A540'
  },
  iconStyle: {
    width: 20,
    height: 20
  },
  buttonView: {
    height: 44,
    width: p2d(335),
    backgroundColor: '#E85C40',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    borderRadius: 2,
    marginBottom: 15
  },
  buttonText: {
    fontSize: 14,
    color: '#fff'
  }
})
