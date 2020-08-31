import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { SafeAreaView } from '../navigationbar'
import Image from '../image'
import p2d from '../../../src/expand/tool/p2d'
export default class CreateMemberView extends PureComponent {
  render() {
    const { subscription, buttonOnPress, type } = this.props
    const isRenew = type === 'renew'
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <Image
            source={require('../../../assets/images/me_style/pay_success.png')}
            style={styles.payImage}
          />
          <Text style={styles.textTitle}>
            {!isRenew ? '成功加入托特衣箱' : '续费成功'}
          </Text>
          {!isRenew && (
            <View>
              <View style={styles.line} />
              <Text style={styles.textDescription}>
                {`会员期从首个衣箱寄出或\n ${
                  subscription.remain_additional_days
                }天后开始计算`}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.buttonView, isRenew && styles.renewButtonView]}
            onPress={buttonOnPress}>
            <Text
              style={[styles.buttonText, isRenew && styles.renewButtonText]}>
              {isRenew ? '返回' : '开启时尚之旅'}
            </Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  payImage: {
    width: p2d(76),
    height: p2d(76)
  },
  textTitle: {
    marginTop: 24,
    fontSize: 16,
    color: '#333',
    letterSpacing: 5
  },
  line: {
    width: p2d(200),
    height: 1,
    backgroundColor: '#EA5C39',
    marginTop: 12
  },
  textDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
    marginTop: 8,
    textAlign: 'center'
  },
  buttonView: {
    marginTop: 28,
    width: 164,
    height: 50,
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center'
  },
  renewButtonView: {
    backgroundColor: '#FFF',
    borderColor: '#ccc',
    borderWidth: 1
  },
  buttonText: {
    fontSize: 14,
    color: '#FFF'
  },
  renewButtonText: {
    color: '#666'
  }
})
