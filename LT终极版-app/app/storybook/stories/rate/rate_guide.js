import React, { PureComponent } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import Image from '../image'
import p2d from '../../../src/expand/tool/p2d'
export default class LabelView extends PureComponent {
  render() {
    const { nickname, hideRateGuide } = this.props
    return (
      <View style={styles.container}>
        <Image
          style={{ width: p2d(375), height: p2d(170) }}
          source={require('../../../assets/images/rating/rate_guide.png')}
        />
        <View style={styles.cardView}>
          <Text numberOfLines={1} style={styles.nickName}>
            亲爱的{nickname}
          </Text>
          <View style={styles.tipsView}>
            <Text style={styles.tips}>
              我们非常希望你的每个衣箱都能获得完美体验，但如果遇到了商品问题导致无法穿着，请在预约归还之前及时告知，我们承诺会安排专人尽快帮你解决所投诉的问题，为你的穿搭体验保驾护航
            </Text>
            <Text
              style={[styles.tips, { alignSelf: 'flex-end', marginTop: 18 }]}>
              LE TOTE 托特衣箱
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={hideRateGuide}>
            <Text style={styles.buttonText}>我知道了</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cardView: {
    marginTop: -28,
    flex: 1,
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#fff'
  },
  nickName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '700',
    width: 256,
    marginTop: 56
  },
  tipsView: {
    width: 256,
    marginTop: 18
  },
  tips: {
    fontSize: 14,
    color: '#333',
    lineHeight: 24,
    letterSpacing: 0.2
  },
  button: {
    width: 263,
    height: 44,
    backgroundColor: '#E85C40',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginTop: 44
  },
  buttonText: {
    fontSize: 14,
    color: '#fff'
  }
})
