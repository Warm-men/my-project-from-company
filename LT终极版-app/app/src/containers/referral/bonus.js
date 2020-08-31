/* @flow */

import React, { Component, PureComponent } from 'react'
import { View, StyleSheet, FlatList, RefreshControl, Text } from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services'
import p2d from '../../expand/tool/p2d'
import dateFns from 'date-fns'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { inject } from 'mobx-react'

@inject('currentCustomerStore')
export default class BonusContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      purchaseCredit: null, //总数
      spentPurchaseCredit: null, //已使用
      availablePurchaseCredit: null, //可使用
      timeCashTransactions: [],
      refreshing: false,
      isMore: false
    }
  }
  componentDidMount() {
    this._getAvailablePurchaseCredit()
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }
  //获取奖励金
  _getAvailablePurchaseCredit = () => {
    this.setState({ isMore: true })
    QNetwork(
      SERVICE_TYPES.me.QUERY_ME_PURCHASE_CREDIT,
      {},
      response => {
        const { me } = response.data
        let spentPurchaseCredit = me.spent_purchase_credit.amount
        let expiredPurchaseCredit = me.expired_purchase_credit.amount
        let availablePurchaseCredit = me.available_purchase_credit.amount
        let purchaseCredit =
          spentPurchaseCredit + expiredPurchaseCredit + availablePurchaseCredit
        let timeCashTransactions = me.time_cash_transactions
        this.setState({
          purchaseCredit,
          spentPurchaseCredit,
          availablePurchaseCredit,
          timeCashTransactions,
          refreshing: false,
          isMore: false
        })

        const { currentCustomerStore } = this.props
        currentCustomerStore.updateAvailablePurchaseCredit(
          me.available_purchase_credit
        )
      },
      () => {
        this.setState({
          refreshing: false,
          isMore: false
        })
      }
    )
  }
  _listEmptyComponent = () => {
    return (
      !this.state.refreshing &&
      this.state.isMore && (
        <View style={styles.emptyView}>
          <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
        </View>
      )
    )
  }
  _listHeaderComponent = () => {
    const headerDate = this.state
    return <ReferralHeader headerDate={headerDate} />
  }
  _onRefresh = () => {
    if (!this.state.refreshing) {
      this._getAvailablePurchaseCredit()
    }
  }
  _extractUniqueKey(item, index) {
    return item.created_at.toString() + index.toString()
  }
  _renderItem = ({ item }) => {
    return <ReferralItem timeCashTransactionsItem={item} />
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          hasBottomLine={false}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <FlatList
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyExtractor={this._extractUniqueKey}
          data={this.state.timeCashTransactions}
          extraData={this.state.isMore}
          renderItem={this._renderItem}
          refreshControl={
            <RefreshControl
              onRefresh={this._onRefresh}
              refreshing={this.state.refreshing}
            />
          }
          ListEmptyComponent={this._listEmptyComponent}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={this._listHeaderComponent}
        />
      </SafeAreaView>
    )
  }
}

class ReferralItem extends PureComponent {
  render() {
    const {
      transaction_type,
      income,
      created_at,
      amount
    } = this.props.timeCashTransactionsItem
    const createdAt = dateFns.format(created_at, 'YYYY-MM-DD  HH:mm')
    return (
      <View style={styles.referralView}>
        <View style={styles.itemChild}>
          <Text style={styles.transactionType}>{transaction_type}</Text>
          <Text style={styles.createdAt}>{createdAt}</Text>
        </View>
        <View style={styles.itemChild}>
          <Text style={income ? styles.income : styles.spent}>
            {income ? '+' : '-'}
            {amount}
          </Text>
        </View>
      </View>
    )
  }
}

class ReferralHeader extends PureComponent {
  render() {
    const {
      purchaseCredit,
      spentPurchaseCredit,
      availablePurchaseCredit
    } = this.props.headerDate
    return (
      <View style={styles.warpper}>
        <View style={styles.headerView}>
          <Text style={styles.balanceTitle}>{'余额(元)'}</Text>
          <Text style={styles.balanceDescript}>
            {availablePurchaseCredit ? availablePurchaseCredit : 0}
          </Text>
        </View>
        <View style={styles.bonusDescriptBar}>
          <View style={styles.bonusDescriptBarItem}>
            <Text style={styles.credit}>
              {purchaseCredit ? purchaseCredit : 0}
            </Text>
            <Text style={styles.creditDescript}>{'累计获得(元)'}</Text>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.bonusDescriptBarItem}>
            <Text style={styles.credit}>
              {spentPurchaseCredit ? spentPurchaseCredit : 0}
            </Text>
            <Text style={styles.creditDescript}>{'已使用(元)'}</Text>
          </View>
        </View>
        <View style={styles.titleView}>
          <View style={styles.line} />
          <Text style={styles.title}>{'奖励金明细'}</Text>
          <View style={styles.line} />
        </View>
        <Text style={styles.message}>
          {'奖励金可用于续费或购买服饰，可累计使用'}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  warpper: {
    marginBottom: p2d(38)
  },
  headerView: {
    height: p2d(142),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#FFF'
  },
  balanceTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10
  },
  balanceDescript: {
    fontSize: 36,
    color: '#EA5C39',
    fontWeight: '600'
  },
  bonusDescriptBar: {
    height: p2d(58),
    backgroundColor: '#F7F7F7',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  verticalLine: {
    height: p2d(37),
    width: 1,
    backgroundColor: '#E9E9E9'
  },
  bonusDescriptBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  credit: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4
  },
  creditDescript: {
    fontSize: 12,
    color: '#666'
  },
  titleView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 32,
    paddingHorizontal: 20
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: '#F2F2F2'
  },
  title: {
    marginHorizontal: 8,
    fontSize: 13,
    color: '#333'
  },
  message: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
    marginTop: 13,
    textAlign: 'center'
  },
  referralView: {
    height: p2d(63),
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#F2F2F2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  transactionType: {
    fontSize: 13,
    color: '#333',
    marginBottom: 9
  },
  createdAt: {
    fontSize: 12,
    color: '#999'
  },
  income: {
    fontSize: 16,
    color: '#EA5C39',
    fontWeight: '600'
  },
  spent: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600'
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
