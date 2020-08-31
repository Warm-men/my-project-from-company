import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import {
  abTrack,
  Experiment,
  Variant
} from '../../../../src/components/ab_testing'

export default class FreeServiceBanner extends PureComponent {
  _openContract = () => {
    this.props.navigation.navigate('Contract')
    abTrack('clickFreeServerTips', 1)
  }

  render() {
    const { autoRenewDiscount, style, autoRenewDiscountAmount } = this.props
    if (!!autoRenewDiscountAmount) {
      // 有免密开通提醒
      return (
        <View style={[styles.container, style]}>
          <View>
            <Text style={styles.text}>
              开通自动续费，
              <Text style={{ color: '#d7a33f' }}>
                每月直减¥{autoRenewDiscountAmount}
              </Text>
            </Text>
            <Text style={styles.smallText}>自动续费可随时关闭</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={this._openContract}>
            <Experiment
              defaultValue={0}
              flagName={'join_member_free_server_tips'}>
              <Variant value={0}>
                <Text style={styles.openContractText}>立即开通</Text>
              </Variant>
              <Variant value={1}>
                <Text style={styles.openContractText}>开通领优惠</Text>
              </Variant>
            </Experiment>
          </TouchableOpacity>
        </View>
      )
    } else if (!!autoRenewDiscount) {
      // 有开通免密优惠提醒
      return (
        <View style={[styles.container, style, { height: 49 }]}>
          <Text style={styles.openingText}>
            已开通自动续费，已减¥{autoRenewDiscount}
          </Text>
        </View>
      )
    } else {
      return null
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 48
  },
  text: {
    fontSize: 14,
    color: '#242424',
    paddingLeft: 10,
    fontWeight: '400'
  },
  smallText: {
    paddingLeft: 10,
    fontSize: 12,
    color: '#989898',
    marginTop: 7,
    fontWeight: '400'
  },
  openingText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5e5e5e',
    paddingLeft: 10
  },
  button: {
    height: 26,
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EA5C39',
    borderRadius: 2
  },
  openContractText: {
    fontSize: 13,
    color: '#EA5C39'
  },
  value: {
    fontSize: 14,
    color: '#EA5C39'
  }
})
