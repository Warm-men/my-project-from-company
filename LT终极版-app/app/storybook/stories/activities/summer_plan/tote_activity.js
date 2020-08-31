/* @flow weak */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../image'
import Icons from 'react-native-vector-icons/Ionicons'
import p2d from '../../../../src/expand/tool/p2d'
export default class SummerPlanToteActivity extends PureComponent {
  render() {
    const { pushToSummerPlan } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.viewImage}>
          <Image
            source={require('../../../../assets/images/activities/gift_icon.png')}
          />
        </View>
        <Text style={styles.title}>
          {'托特衣箱升级季期间，会员尊享 每个衣箱免费增加一个衣位'}
        </Text>
        <View style={styles.viewTouch}>
          <TouchableOpacity onPress={pushToSummerPlan} style={styles.button}>
            <Text style={styles.buttonTitle}>{'领取福利'}</Text>
            <Icons name="ios-arrow-forward" size={16} color="#E89140" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 62,
    backgroundColor: '#FFF6E9',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15
  },
  viewImage: {
    flex: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    flex: 53,
    lineHeight: 18,
    fontSize: p2d(13) > 13 ? 13 : p2d(13),
    fontWeight: '400',
    color: '#E89140'
  },
  button: {
    width: 85,
    height: 32,
    borderWidth: 1,
    borderColor: '#E89140',
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonTitle: {
    lineHeight: 30,
    marginBottom: 2,
    fontSize: 13,
    paddingRight: 5,
    fontWeight: '400',
    color: '#E89140'
  },
  viewTouch: {
    flex: 32,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
