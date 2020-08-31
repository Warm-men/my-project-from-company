/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { l10nForSize } from '../../../../src/expand/tool/product_l10n'
import WearContainer from './input_wear_items'

export default class Header extends PureComponent {
  render() {
    const { product, productSize, data, updateWearTimes } = this.props
    const { catalogue_photos, title } = product
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{
            uri: catalogue_photos ? catalogue_photos[0].medium_url : ''
          }}
        />
        <View style={styles.contentView}>
          <View style={styles.titleView}>
            <Text style={styles.title}>{title}</Text>
            {productSize ? (
              <Text style={styles.title}>
                {l10nForSize(productSize.size_abbreviation)}
              </Text>
            ) : null}
          </View>
          {data && (
            <WearContainer data={data} updateWearTimes={updateWearTimes} />
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#F3F3F3'
  },
  image: { width: 56, height: 81, marginRight: 16 },

  contentView: { justifyContent: 'center', flex: 1 },

  titleView: { flexDirection: 'row' },
  title: { color: '#242424', marginRight: 16 }
})
