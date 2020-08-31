/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Products from './tote_past_products'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import { format } from 'date-fns'
import { sortToteProducts } from '../../../../src/expand/tool/totes'
import p2d from '../../../../src/expand/tool/p2d'
export default class PastTote extends PureComponent {
  _goPastTote = () => {
    const { tote, rateTote } = this.props
    rateTote(tote)
  }

  returnToteRating = () => {
    const { tote_rating } = this.props.tote
    let toteRating = []
    Array.from({ length: tote_rating.rating }).map((item, index) => {
      toteRating.push(
        <Icon
          key={index}
          style={styles.star}
          name="star"
          size={20}
          color="#F3BF78"
        />
      )
    })
    if (tote_rating.rating < 5) {
      Array.from({ length: 5 - tote_rating.rating }).map((item, index) => {
        toteRating.push(
          <Icon
            key={index + 10} //为了避免相同的key
            style={styles.star}
            name="star"
            size={20}
            color="#E4E4E4"
          />
        )
      })
    }
    return toteRating
  }

  render() {
    const { didSelectedItem, tote, displayRateIncentiveGuide } = this.props
    const { tote_products, id, locked_at, rating_incentive } = tote
    const sortProducts = sortToteProducts(tote_products)
    const buttonText =
      displayRateIncentiveGuide && rating_incentive ? `评价领奖励` : `查看评价`
    const lockedTime = format(locked_at, 'YYYY-M-D')
    const starAmount = tote && tote.tote_rating && this.returnToteRating()
    return (
      <TouchableOpacity style={styles.container} onPress={this._goPastTote}>
        <View style={styles.headView}>
          <Text style={styles.deliveredText}>{`下单时间：${lockedTime}`}</Text>
          <View style={styles.starView}>{starAmount}</View>
        </View>
        <Products
          products={sortProducts}
          didSelectedItem={didSelectedItem}
          toteId={id}
          navigation={this.props.navigation}
        />
        <View style={styles.buttonViewWrapper}>
          <View style={styles.buttonView}>
            <Text style={styles.details}>{buttonText}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: p2d(16),
    borderRadius: 4,
    elevation: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    backgroundColor: '#FFF',
    marginTop: 16,
    marginBottom: 1
  },
  buttonViewWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 15,
    paddingRight: 16,
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 4
  },
  buttonView: {
    width: p2d(95),
    height: 32,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  headView: {
    height: 50,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  deliveredText: {
    color: '#5E5E5E',
    fontSize: 14,
    letterSpacing: 0.4
  },
  starView: {
    flexDirection: 'row'
  },
  star: {
    marginLeft: 5
  },
  text: {
    color: '#EA5C39'
  },
  schedulePickUpInfo: {
    margin: 15,
    backgroundColor: '#E3E3E3'
  },
  details: {
    fontSize: 13,
    color: '#242424'
  }
})
