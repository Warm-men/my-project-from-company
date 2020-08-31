/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { l10nForDetail } from '../../../../src/expand/tool/product_l10n'
export default class ProductDetailInfo extends PureComponent {
  returnSeasons = () => {
    const { primary_seasons } = this.props.product
    let seasons = []
    if (primary_seasons && !!primary_seasons.length) {
      primary_seasons.map((item, index) => {
        if (index + 1 !== primary_seasons.length) {
          seasons.push(`${item.name_cn} `)
        } else {
          seasons.push(`${item.name_cn}`)
        }
      })
    }
    return seasons
  }

  render() {
    const { product } = this.props
    const seasons = this.returnSeasons()
    return (
      <View style={styles.container}>
        <View style={styles.detailTitle}>
          <Text style={styles.detailsSubTitle}>商品信息</Text>
        </View>
        {product.details &&
          product.details.map((detail, index) => {
            const { localDescription, localValue } = l10nForDetail(detail)
            return (
              !!localDescription && (
                <View key={index} style={styles.item}>
                  <Text style={styles.labelLeft}>{localDescription}</Text>
                  <View style={styles.labelView}>
                    <Text style={styles.labelRight}>{localValue}</Text>
                  </View>
                </View>
              )
            )
          })}
        {!!seasons.length && (
          <View style={styles.item}>
            <Text style={styles.labelLeft}>适合季节</Text>
            <View style={styles.labelView}>
              <Text style={styles.labelRight}>{seasons}</Text>
            </View>
          </View>
        )}
        <View style={styles.priceView}>
          <Text style={styles.labelLeft}>零售价格</Text>
          <Text style={styles.price}>¥{product.full_price}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3'
  },
  detailTitle: {
    marginTop: 24,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  item: {
    flexDirection: 'row',
    minHeight: 60,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingTop: 20,
    paddingBottom: 20
  },
  labelLeft: {
    fontSize: 14,
    color: '#666',
    paddingTop: 3
  },
  labelView: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 30
  },
  labelRight: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  priceView: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: {
    fontWeight: '600',
    fontSize: 16,
    color: '#EA5C39'
  },
  detailsSubTitle: { fontWeight: '600', fontSize: 18, color: '#242424' }
})
