/* @flow */

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Image from '../../../../storybook/stories/image'
import { inject, observer } from 'mobx-react'
import p2d from '../../../expand/tool/p2d'
import { CountDown } from '../../../../storybook/stories/home/onboarding'
import { Column } from '../../../expand/tool/add_to_closet_status'
import { abTrack } from '../../../components/ab_testing'
import { onClickJoinMember } from '../../../expand/tool/plans/join_member'
import ProductsCard from './onboarding_product_card'

@inject('totesStore', 'currentCustomerStore')
@observer
export default class Onboarding extends Component {
  _goOnboarding = () => {
    const { currentCustomerStore, navigation } = this.props
    if (!currentCustomerStore.id) {
      currentCustomerStore.setLoginModalVisible(true)
    } else {
      navigation.navigate('Onboarding')
    }
  }

  _didSelectedItem = product => {
    const column = Column.CurrentTote
    this.props.navigation.navigate('Details', { item: product, column })
  }

  _keyExtractor = (item, index) => index.toString()

  _goOnboardingTote = () => {
    this.props.navigation.navigate('OnboardingTote')
  }

  _goJoinMember = () => {
    abTrack('onboarding_13', 1)
    const { navigation } = this.props
    onClickJoinMember(navigation)
    navigation.navigate('JoinMember')
  }

  render() {
    const { buttonTitle, totesStore } = this.props
    const { latest_rental_tote, totalToteCount } = totesStore
    const currentTotalToteCount = parseInt(totalToteCount, 10).toLocaleString()
    return (
      <View style={styles.cardView}>
        <Text style={styles.cardViewButtonText}>
          {'托特衣箱已在全球发出'}
          <Text style={styles.cardViewButtonRedText}>
            {currentTotalToteCount}
          </Text>
          {'个衣箱'}
        </Text>
        {latest_rental_tote ? (
          <View>
            <ProductsCard
              didSelectedItem={this._didSelectedItem}
              toteProducts={latest_rental_tote.tote_products}
            />
            <View style={styles.buttonView}>
              <TouchableOpacity
                onPress={this._goOnboardingTote}
                style={styles.checkTote}>
                <Text style={styles.checkToteText}>{'查看衣箱'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this._goJoinMember}
                style={styles.productsItemButton}>
                <Text style={styles.buttonText}>
                  {'立即下单'}
                  <CountDown
                    stockLockedAt={latest_rental_tote.stock_locked_at}
                  />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.viewWrapper}>
            <TouchableOpacity
              disabled={latest_rental_tote}
              onPress={this._goJoinMember}>
              <Image
                style={styles.banner}
                source={require('../../../../assets/images/home/onboarding_tote.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cardViewButton}
              onPress={this._goOnboarding}>
              <Text style={styles.joinMemberText}>{buttonTitle}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cardView: {
    backgroundColor: '#FFF',
    marginHorizontal: p2d(15),
    borderRadius: 5,
    marginTop: p2d(20),
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f3f3',
    shadowColor: '#000',
    shadowOffset: { height: 6, width: 1 },
    shadowRadius: 4,
    shadowOpacity: 0.05,
    alignItems: 'center'
  },
  cardViewButton: {
    marginTop: p2d(16),
    width: p2d(312),
    height: p2d(40),
    backgroundColor: '#EA5C39',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: p2d(24)
  },
  cardViewButtonText: {
    fontSize: 14,
    color: '#000',
    marginTop: p2d(24),
    marginBottom: p2d(18)
  },
  cardViewButtonRedText: {
    fontSize: 18,
    color: '#E85C40'
  },
  buttonView: {
    marginBottom: p2d(24),
    flexDirection: 'row'
  },
  checkTote: {
    width: p2d(148),
    height: p2d(40),
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  checkToteText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333'
  },
  banner: {
    width: p2d(311),
    height: p2d(66)
  },
  joinMemberText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600'
  },
  productsSrollView: {
    backgroundColor: '#333',
    borderRadius: 4,
    marginBottom: 16,
    flexGrow: 0,
    width: p2d(311),
    height: p2d(90)
  },
  productsItemCard: {
    paddingVertical: p2d(15),
    paddingLeft: p2d(8),
    paddingRight: p2d(15),
    flexDirection: 'row'
  },
  productsItem: {
    borderRadius: 2,
    marginLeft: p2d(8)
  },
  productsItemImage: {
    width: p2d(40),
    height: p2d(60)
  },
  productsItemButton: {
    width: p2d(148),
    height: p2d(40),
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E85C40',
    marginLeft: p2d(15)
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff'
  },
  viewWrapper: {
    alignItems: 'center'
  }
})
