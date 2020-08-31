/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  DeviceEventEmitter
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
import Image from '../../../../storybook/stories/image'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { inject, observer } from 'mobx-react'
import PopUpPanel from '../../../components/pop_up_panel'
import PayType from '../../../../storybook/stories/account/join_member/pay_type_view'
import { purchaseOverdraft } from '../../../expand/tool/payment'
import { getCreditAccount } from '../../../request'
import BonusItem from '../../../../storybook/stories/account/credit_account/bonus_item'
import BonusHeader from '../../../../storybook/stories/account/credit_account/bonus_header'
import { updateBalance } from '../../../expand/tool/balance'
@inject('currentCustomerStore', 'appStore')
@observer
export default class CreditAccountContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      transactions: [],
      refreshing: false,
      isMore: true,
      pupVisible: false
    }
    this.page = 1
    this.per_page = 20
    this.paymentMethod = 'wechat_native'
  }
  componentDidMount() {
    this._getCreditAccount()
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }
  _getCreditAccount = () => {
    if (this.state.refreshing) {
      this.page = 1
    }
    getCreditAccount(this.page, this.per_page)
      .then(response => {
        this.page++
        let {
          transactions,
          balance,
          referral_amount
        } = response.data.me.credit_account
        let isMore = transactions.length === this.per_page
        transactions = this.state.refreshing
          ? transactions
          : [...this.state.transactions, ...transactions]
        updateBalance(balance)
        this.setState({
          referralAmount: referral_amount,
          transactions,
          refreshing: false,
          isMore
        })
      })
      .catch(() => {
        this.setState({
          refreshing: false,
          isMore: false
        })
      })
  }

  _onEndReached = () => {
    const { refreshing, isMore, transactions } = this.state
    if (!refreshing && isMore && transactions.length) {
      this._getCreditAccount()
    }
  }

  _listEmptyComponent = () => {
    if (!this.state.refreshing && this.state.isMore) {
      return (
        <View style={styles.emptyView}>
          <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
        </View>
      )
    } else {
      return (
        <View style={styles.emptyImageContainer}>
          <Image
            source={require('../../../../assets/images/account/credit/empty_credit_account.png')}
          />
          <Text style={styles.emptyText}>暂无账户明细</Text>
        </View>
      )
    }
  }
  _listHeaderComponent = () => {
    return (
      <BonusHeader
        currentCustomerStore={this.props.currentCustomerStore}
        referralAmount={this.state.referralAmount}
        popUpPanelOnShow={this._popUpPanelOnShow}
        goReferral={this._goReferral}
      />
    )
  }
  _onRefresh = () => {
    if (!this.state.refreshing) {
      this.setState({ refreshing: true }, () => {
        this._getCreditAccount()
      })
    }
  }
  _payment = () => {
    const { appStore } = this.props
    return purchaseOverdraft(this.paymentMethod)
      .then(result => {
        if (result && result.errCode === 0) {
          this._onRefresh()
          DeviceEventEmitter.emit('onRefreshTotes')
        } else {
          appStore.showToast(result.errors[0].message, 'error')
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
  _goReferral = () => {
    this.props.navigation.navigate('Referral')
  }
  _changeType = paymentMethod => {
    this.paymentMethod = paymentMethod
  }
  _extractUniqueKey(item, index) {
    return (
      (item.created_at ? item.created_at.toString() : '') + index.toString()
    )
  }
  _renderItem = ({ item }) => {
    return <BonusItem transactionItem={item} />
  }
  _popUpPanelOnClose = () => {
    this.setState({ pupVisible: false })
  }
  _popUpPanelOnShow = () => {
    this.setState({ pupVisible: true })
  }

  render() {
    const { balance } = this.props.currentCustomerStore
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'信用账户'}
          hasBottomLine={false}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <FlatList
          initialNumToRender={4}
          onEndReachedThreshold={2}
          keyExtractor={this._extractUniqueKey}
          onEndReached={this._onEndReached}
          showsVerticalScrollIndicator={false}
          data={this.state.transactions}
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
        <PopUpPanel
          ref={popUpPanel => (this._popUpPanel = popUpPanel)}
          onClose={this._popUpPanelOnClose}
          visible={this.state.pupVisible}
          height={190}>
          <PayType
            type={this.paymentMethod}
            changeType={this._changeType}
            price={Math.abs(balance)}
            pay={this._payment}
            onHide={this._popUpPanelOnClose}
          />
        </PopUpPanel>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyImageContainer: {
    flex: 1,
    marginVertical: 86,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    color: '#D1D1D1',
    fontSize: 14,
    marginTop: 15
  }
})
