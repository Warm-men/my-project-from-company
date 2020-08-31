/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import ToteReturnScheduleFreeServiceDetails from './tote_return_schedule_free_service_detail'
import ProductList from '../../tote_cart/shoppingCar/tote_tracker_products'

export default class ToteReturnScheduleProductsCard extends PureComponent {
  returnTote = tote_products => {
    let toteProducts = tote_products.filter(function(item) {
      return (
        item.transition_state !== 'purchased' &&
        item.transition_state !== 'returned'
      )
    })
    return toteProducts
  }
  render() {
    const {
      scheduled_return: { tote, tote_free_service },
      tote_products
    } = this.props.tote
    const productsListTitle =
      !!tote && !!tote_free_service ? '待归还衣箱' : '归还衣箱'
    const returnTote = this.returnTote(tote_products)
    return (
      <View>
        {!!tote && !!tote_free_service && (
          <View style={styles.heardTitleView}>
            <View style={styles.line} />
            <Text style={styles.heardTitleText}>{'本次需归还'}</Text>
            <View style={styles.line} />
          </View>
        )}
        {!!tote_free_service && (
          <ToteReturnScheduleFreeServiceDetails
            toteFreeService={tote_free_service}
          />
        )}
        {!!tote && (
          <View style={styles.viewWrapper}>
            <View style={styles.titleView}>
              <Text style={styles.titleText}>{productsListTitle}</Text>
            </View>
            <ProductList disabled={true} products={returnTote} />
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  heardTitleView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: p2d(16),
    marginHorizontal: p2d(16)
  },
  line: {
    height: 1,
    width: p2d(78),
    backgroundColor: '#CCC'
  },
  heardTitleText: {
    fontSize: 16,
    color: '#242424',
    fontWeight: '500',
    marginHorizontal: p2d(8),
    letterSpacing: 0.46
  },
  subTitleVeiw: {
    paddingHorizontal: p2d(16),
    marginTop: p2d(32)
  },
  subTitleText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  titleView: {
    marginTop: p2d(16),
    marginBottom: p2d(24)
  },
  titleText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  viewWrapper: {
    marginHorizontal: p2d(16)
  }
})
