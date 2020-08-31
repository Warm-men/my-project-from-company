import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import Image from '../image'
import dateFns from 'date-fns'
export default class ExchangeComplete extends PureComponent {
  didSelectedButton = () => {
    const { isSuccessed, resetResult, goCoupon, exchangeName } = this.props
    if (isSuccessed) {
      if (exchangeName) {
        resetResult && resetResult()
      } else {
        goCoupon && goCoupon()
      }
    } else {
      resetResult && resetResult()
    }
  }
  render() {
    const { isSuccessed, promoCode, errors, exchangeName } = this.props
    const time =
      promoCode && promoCode.expiration_date
        ? dateFns.format(promoCode.expiration_date, 'YYYY年MM月DD日')
        : null
    const url = isSuccessed
      ? require('../../../assets/images/rating/success.png')
      : require('../../../assets/images/rating/fail.png')
    return (
      <View style={styles.completeContainer}>
        <Image style={styles.icon} source={url} />
        {!exchangeName && (
          <Text style={styles.result}>
            {isSuccessed ? '优惠券兑换成功' : '优惠券兑换失败'}
          </Text>
        )}
        <Text style={styles.tips}>
          {isSuccessed
            ? exchangeName
              ? `兑换${exchangeName}成功`
              : `${promoCode.title}已放入你的账户\n有效期至${time}`
            : errors}
        </Text>
        <TouchableOpacity
          onPress={this.didSelectedButton}
          style={[
            styles.button,
            isSuccessed && { backgroundColor: '#EA5C39', borderWidth: 0 }
          ]}>
          <Text style={[styles.buttonText, isSuccessed && { color: '#fff' }]}>
            {isSuccessed ? (exchangeName ? '返回' : '立即使用') : '返回'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

ExchangeComplete.defaultProps = {
  isSuccessed: true,
  promoCode: null,
  errors: [],
  resetResult: () => {},
  goCoupon: () => {},
  exchangeName: null
}

ExchangeComplete.propTypes = {
  isSuccessed: PropTypes.bool,
  promoCode: PropTypes.object,
  errors: PropTypes.array,
  resetResult: PropTypes.func,
  goCoupon: PropTypes.func,
  exchangeName: PropTypes.string
}

const styles = StyleSheet.create({
  completeContainer: {
    alignItems: 'center',
    flex: 1
  },
  icon: {
    marginBottom: 24,
    marginTop: 80
  },
  result: {
    fontSize: 16,
    color: '#333',
    fontWeight: '700',
    letterSpacing: 1
  },
  tips: {
    fontSize: 14,
    color: '#999',
    marginTop: 16,
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center'
  },
  button: {
    height: 44,
    width: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  buttonText: {
    fontSize: 14,
    color: '#333'
  }
})
