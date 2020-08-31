/* @flow */

import React, { Component, PureComponent } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import { allowToStartLoad } from '../../../src/expand/tool/url_filter'
import { inject, observer } from 'mobx-react'

@inject('productsOccasionStore')
@observer
export default class ProductsCollection extends Component {
  _didSelectedItem = uri => {
    const { navigation } = this.props
    const useWebView = allowToStartLoad(uri, navigation, false)
    if (useWebView) {
      navigation.navigate('WebPage', { uri })
    }
  }

  render() {
    const { bannerType, productsOccasionStore } = this.props
    let bannerGroup = []
    if (bannerType === 'clothing_list_top') {
      bannerGroup = productsOccasionStore.clothingListTopBanner
    } else {
      bannerGroup = productsOccasionStore.accessoryListTopBanner
    }
    if (bannerGroup.length !== 4) return null
    return (
      <View style={styles.container}>
        {bannerGroup.map((item, index) => {
          return (
            <ProductsCollectionItem
              key={index}
              data={item}
              didSelectedItem={this._didSelectedItem}
            />
          )
        })}
      </View>
    )
  }
}

class ProductsCollectionItem extends PureComponent {
  _didSelectedItem = () => {
    const { data, didSelectedItem } = this.props
    if (didSelectedItem && data) {
      didSelectedItem(data.link)
    }
  }
  render() {
    const { data } = this.props
    if (!data) return null

    return (
      <TouchableOpacity style={styles.item} onPress={this._didSelectedItem}>
        <Image style={styles.image} source={{ uri: data.image_url }} />
        <Text style={styles.text} numberOfLines={1}>
          {data.title}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 8
  },
  item: { alignItems: 'center', flex: 1, paddingTop: 2 },
  image: { width: p2d(64), height: p2d(64), borderRadius: p2d(32) },
  text: { fontSize: 12, color: '#5E5E5E', marginTop: 10 }
})
