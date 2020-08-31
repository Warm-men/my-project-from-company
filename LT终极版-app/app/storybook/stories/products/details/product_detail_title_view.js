/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import ProductEnsemble from './product_detail_ensemble'

export default class ProductTitleView extends PureComponent {
  render() {
    const { navigation, product } = this.props
    const { brand, title, tags, tote_slot, type, ensemble } = product

    const name = type === 'Accessory' ? '配饰位' : '衣位'
    const toteSlotTip = tote_slot > 1 ? `占${tote_slot}个${name}` : null

    return (
      <View style={styles.titleView}>
        <Text style={styles.brand}>{brand && brand.name}</Text>
        <View style={styles.fdView}>
          <Text style={styles.title}>{title}</Text>
          {toteSlotTip && <View style={styles.line} />}
          {toteSlotTip && (
            <Text testID="tote-slot-tip" style={styles.title}>
              {toteSlotTip}
            </Text>
          )}
        </View>
        <View style={styles.tagsView}>
          {!!tags &&
            tags.map((item, index) => {
              const { font_color, bg_color } = item
              const tagStyle = { color: font_color, backgroundColor: bg_color }
              return (
                <Text key={index} style={[styles.tag, tagStyle]}>
                  {item.title}
                </Text>
              )
            })}
        </View>
        <ProductEnsemble navigation={navigation} ensemble={ensemble} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fdView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleView: {
    marginHorizontal: 15,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2'
  },
  brand: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    color: '#333'
  },
  title: {
    marginTop: 10,
    fontWeight: '400',
    fontSize: 12,
    color: '#666'
  },
  tagsView: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tag: {
    lineHeight: 20,
    paddingHorizontal: 8,
    fontSize: 12,
    marginRight: 8,
    marginBottom: 4,
    borderRadius: 2,
    overflow: 'hidden'
  },
  line: {
    backgroundColor: '#ccc',
    width: 1,
    height: 12,
    marginHorizontal: 8,
    marginTop: 10
  }
})
