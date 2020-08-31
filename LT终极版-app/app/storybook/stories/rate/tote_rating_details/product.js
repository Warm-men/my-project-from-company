/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { l10nForSize } from '../../../../src/expand/tool/product_l10n'

export default class Product extends PureComponent {
  _didSelectedItem = () => {
    const { item, didSelectedItem } = this.props
    didSelectedItem && didSelectedItem(item.product)
  }
  _rating = () => {
    const { ratingProduct, item } = this.props
    ratingProduct && ratingProduct(item)
  }

  render() {
    const {
      product,
      product_size,
      transition_state,
      transition_info,
      rating,
      service_feedback
    } = this.props.item

    const { title, brand, member_price, catalogue_photos, full_price } = product

    const returned = transition_state === 'returned'
    const price = returned ? member_price : transition_info.modified_price

    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          <TouchableOpacity onPress={this._didSelectedItem}>
            <Image
              style={styles.image}
              source={{
                uri: catalogue_photos ? catalogue_photos['0'].medium_url : ''
              }}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={styles.name}>
              {brand ? brand.name : ''}
            </Text>
            <Text numberOfLines={1} style={styles.content}>
              {title}
            </Text>
            <Text style={styles.content}>
              {l10nForSize(product_size.size_abbreviation)}
            </Text>
            <Text style={styles.price}>
              ¥{price + '  '}
              <Text style={styles.fullPrice}>¥{full_price}</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              rating ? styles.finishedButton : styles.normalButton
            ]}
            onPress={this._rating}>
            <Text style={rating ? styles.finishedTitle : styles.normalTitle}>
              {rating ? '查看评价' : '评价单品'}
            </Text>
          </TouchableOpacity>
        </View>
        <ServiceFeedback data={service_feedback} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { padding: 16, borderBottomWidth: 1, borderColor: '#F2F2F2' },
  topView: { flexDirection: 'row', alignItems: 'center' },
  image: { width: 72, height: 104, marginRight: 16 },
  name: { fontSize: 14, color: '#242424', marginBottom: 8 },
  content: { fontSize: 12, color: '#989898', marginBottom: 8 },
  price: { fontSize: 14, color: '#242424' },
  fullPrice: {
    fontSize: 12,
    color: '#989898',
    textDecorationLine: 'line-through'
  },
  button: {
    width: 75,
    height: 26,
    borderWidth: 0.5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  normalButton: { borderColor: '#E85C40' },
  finishedButton: { borderColor: '#ccc' },
  finishedTitle: { color: '#5e5e5e', fontSize: 12 },
  normalTitle: { color: '#E85C40', fontSize: 12 },

  serviceFeedback: { flex: 1, flexDirection: 'row', marginTop: 10 },
  feedbackTitle: {
    fontSize: 12,
    color: '#5e5e5e',
    marginLeft: 12,
    lineHeight: 40,
    marginRight: 16
  },
  feedbackContent: { flexWrap: 'wrap', flexDirection: 'row', flex: 1 },
  feedbackItem: {
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f7f7f7',
    marginRight: 6,
    lineHeight: 20,
    fontSize: 12,
    color: '#5e5e5e',
    paddingHorizontal: 8,
    overflow: 'hidden',
    marginTop: 10
  }
})

class ServiceFeedback extends PureComponent {
  render() {
    const { data } = this.props
    if (!data) {
      return null
    }
    const { quality_issues_human_names } = data
    return (
      <View style={styles.serviceFeedback}>
        <Text style={styles.feedbackTitle}>商品投诉</Text>
        <View style={styles.feedbackContent}>
          {quality_issues_human_names.map(item => {
            return (
              <Text style={styles.feedbackItem} key={item}>
                {item}
              </Text>
            )
          })}
        </View>
      </View>
    )
  }
}
