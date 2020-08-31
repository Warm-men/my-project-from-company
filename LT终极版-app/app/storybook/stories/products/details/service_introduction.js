/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { inject, observer } from 'mobx-react'
import ImageView from '../../image'
import { Experiment, Variant } from '../../../../src/components/ab_testing'
import p2d from '../../../../src/expand/tool/p2d'
import { allowToStartLoad } from '../../../../src/expand/tool/url_filter'

@inject('currentCustomerStore')
@observer
export default class ServiceIntroduction extends Component {
  _serviceIntroduction = () => {
    const uri =
      'https://static.letote.cn/pages/homepage_introduce_190812/index.html'
    const { navigation } = this.props
    const useWebView = allowToStartLoad(uri, navigation)
    if (useWebView) {
      navigation.navigate('WebPage', { uri })
    }
  }
  render() {
    const { isSubscriber } = this.props.currentCustomerStore
    if (isSubscriber) return null
    return (
      <Experiment
        defaultValue={1}
        flagName={'service_introduction_in_product_detail'}>
        <Variant value={1} />
        <Variant value={2}>
          <View style={styles.container}>
            <Text style={styles.titleText}>开通会员免费穿</Text>
            <ImageView
              style={styles.flowImage}
              source={require('../../../../assets/images/product_detail/service_flow.png')}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this._serviceIntroduction}>
              <ImageView
                style={styles.servieceImage}
                source={require('../../../../assets/images/product_detail/service_introduction.png')}
              />
            </TouchableOpacity>
          </View>
        </Variant>
      </Experiment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    paddingBottom: p2d(32),
    borderBottomColor: '#F3F3F3',
    borderBottomWidth: 1
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#242424',
    letterSpacing: 0.4,
    marginTop: p2d(32),
    marginBottom: p2d(28)
  },
  flowImage: {
    width: p2d(343),
    height: p2d(83)
  },
  servieceImage: {
    width: p2d(343),
    height: p2d(107),
    marginTop: p2d(15)
  }
})
