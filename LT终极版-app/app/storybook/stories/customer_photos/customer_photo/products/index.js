/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import CustomerPhotoProduct from './customer_photo_product'
import { sortToteProducts } from '../../../../../src/expand/tool/totes'
export default class Products extends PureComponent {
  render() {
    const {
      products,
      didSelectedItem,
      getReportData,
      updateClosetStatus
    } = this.props
    if (!products || !products[0].product) {
      return null
    }
    const type = products && products[0].product.type
    let sortProducts = sortToteProducts(products, type === 'Accessory')
    return (
      <View style={styles.container}>
        <Text style={styles.title}>关联单品</Text>
        <ScrollView
          style={styles.scrollView}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {sortProducts.map((item, index) => {
            return (
              <CustomerPhotoProduct
                key={index}
                data={item}
                getReportData={getReportData}
                didSelectedItem={didSelectedItem}
                updateClosetStatus={updateClosetStatus}
              />
            )
          })}
        </ScrollView>
      </View>
    )
  }
}

Products.defaultProps = {
  products: []
}

Products.propTypes = {
  products: PropTypes.array
}

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: 24 },
  scrollView: { marginLeft: 15 },
  title: { color: '#333', marginBottom: 15, fontWeight: '500', paddingLeft: 15 }
})
