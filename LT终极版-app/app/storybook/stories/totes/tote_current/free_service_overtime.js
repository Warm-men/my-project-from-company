/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import Udesk from '../../../../src/expand/tool/udesk'
import { inject, observer } from 'mobx-react'
@inject('currentCustomerStore', 'appStore')
@observer
export default class FreeServiceOvertime extends PureComponent {
  _callCustomerService = () => {
    const { currentCustomerStore, appStore } = this.props
    let customer = {}
    if (currentCustomerStore.id) {
      customer.nickname = currentCustomerStore.nickname
      customer.id = currentCustomerStore.id
    } else {
      customer.nick_name = ''
      customer.id = appStore.getGUID()
    }
    Udesk.updateCustomer(customer)
    Udesk.entryChat()
  }
  render() {
    return (
      <View style={styles.scheduleTextView}>
        <View style={styles.tipTextTitleView}>
          <Text style={styles.tipTextTitle}>自在选</Text>
        </View>
        <Text style={styles.scheduleText}>
          {'            '}
          {'签收已超48小时，将会产生自在选租赁金，如需帮助请联系客服'}
          <Text style={styles.service} onPress={this._callCustomerService}>
            联系客服
          </Text>
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scheduleTextView: {
    flex: 1,
    marginTop: 16
  },
  tipTextTitleView: {
    position: 'absolute',
    left: 0,
    top: 2,
    width: p2d(40),
    height: p2d(17),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    backgroundColor: '#242424',
    zIndex: 1
  },
  tipTextTitle: {
    fontSize: 11,
    color: '#E3B356'
  },
  scheduleText: {
    fontSize: 13,
    color: '#5E5E5E',
    letterSpacing: 0.4,
    lineHeight: 20
  },
  service: {
    color: '#E85C40'
  }
})
