/* @flow */

import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { inject, observer } from 'mobx-react'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import {
  ToteTracker,
  CountDown
} from '../../../storybook/stories/home/onboarding/index'
import { Column } from '../../expand/tool/add_to_closet_status'
import p2d from '../../expand/tool/p2d'
import { onClickJoinMember } from '../../expand/tool/plans/join_member'
import { abTrack } from '../../components/ab_testing'
@inject('currentCustomerStore', 'totesStore')
@observer
export default class OnboardingToteContainer extends Component {
  componentDidMount() {
    abTrack('onboarding_10', 1)
  }

  _didSelectedItem = product => {
    const column = Column.CurrentTote
    this.props.navigation.navigate('Details', { item: product, column })
  }

  _popToHome = () => {
    this.props.navigation.popToTop()
  }

  goTotePreview = () => {
    abTrack('onboarding_11', 1)
    this.props.navigation.navigate('SwapOnboardingController')
  }

  gojoinMember = () => {
    abTrack('onboarding_13', 1)
    const { navigation } = this.props
    onClickJoinMember(navigation)
    navigation.navigate('JoinMember')
  }

  render() {
    const { totesStore } = this.props
    const { latest_rental_tote } = totesStore
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          title={'Le Tote 托特衣箱'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._popToHome} buttonType={'back'} />
          }
        />
        <View
          style={{ flex: 1, backgroundColor: '#F7F7F7', alignItems: 'center' }}>
          <View style={styles.cardView}>
            <ToteTracker
              tote={totesStore.latest_rental_tote}
              didSelectedItem={this._didSelectedItem}
              state={totesStore.latest_rental_tote.state}
            />
            <TouchableOpacity
              onPress={this.goTotePreview}
              style={styles.changeProducts}>
              <Text>更换商品</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 13, color: '#666' }}>
              {latest_rental_tote.onboarding_tips}
            </Text>
            <TouchableOpacity
              onPress={this.gojoinMember}
              style={styles.lockTote}>
              <Text style={{ fontSize: 14, color: '#fff' }}>
                立即下单
                <CountDown
                  extraString={' 库存锁定'}
                  stockLockedAt={latest_rental_tote.stock_locked_at}
                />
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={this._popToHome} style={styles.goHome}>
            <Text style={{ fontSize: 14, color: '#666' }}>返回首页</Text>
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
  cardView: {
    backgroundColor: '#FFF',
    width: p2d(345),
    alignItems: 'center',
    elevation: 1,
    shadowColor: 'black',
    shadowOffset: { h: 0, w: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.08,
    marginTop: p2d(17),
    paddingTop: p2d(14)
  },
  changeProducts: {
    width: p2d(285),
    height: p2d(48),
    borderWidth: 1,
    borderColor: '#B2B2AF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginBottom: p2d(25)
  },
  lockTote: {
    width: p2d(285),
    height: p2d(48),
    backgroundColor: '#E85C40',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginBottom: p2d(32),
    marginTop: p2d(10)
  },
  goHome: {
    width: p2d(285),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
