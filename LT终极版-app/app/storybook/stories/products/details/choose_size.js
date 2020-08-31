/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../image'
import { ProductDetailsSize } from './'
import { inject } from 'mobx-react'
@inject('appStore')
export default class ChooseSize extends PureComponent {
  _onSelectProductSize = didSelectedSize => {
    this.setState({ currentSize: didSelectedSize })
  }
  _didSelectedCurrentSize = () => {
    const { onSelect } = this.props
    if (this.state && this.state.currentSize) {
      onSelect(this.state.currentSize)
    } else {
      this.props.appStore.showToastWithOpacity('请先选择尺码')
    }
  }
  render() {
    const { product, pushToSizeChart, realtimeRecommendedSize } = this.props
    const productSizes = product.product_sizes
    const imageUrl = product.catalogue_photos[0]

    return (
      <View style={styles.container}>
        <View style={styles.sizeContainer}>
          <Image
            source={{ uri: imageUrl ? imageUrl.full_url : '' }}
            style={styles.panelImage}
          />
          <View style={{ justifyContent: 'center' }}>
            <Text style={styles.panelBrand}>
              {product.brand && product.brand.name}
            </Text>
            <Text style={styles.panelTitle}>{product.title}</Text>
          </View>
        </View>
        <ProductDetailsSize
          style={styles.sizeView}
          productSizes={productSizes}
          onSelect={this._onSelectProductSize}
          pushToSizeChart={pushToSizeChart}
          realtimeRecommendedSize={realtimeRecommendedSize}
        />
        <View style={styles.bottomView}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={this._didSelectedCurrentSize}>
            <Text style={styles.actionTitle}>确定</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 270,
    paddingLeft: 15
  },
  bottomView: {
    height: 50,
    flexDirection: 'row',
    marginRight: 15,
    justifyContent: 'space-between'
  },
  bottomButton: {
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA5C39'
  },
  actionTitle: {
    color: 'white',
    fontWeight: '600'
  },
  sizeContainer: {
    marginRight: 15,
    marginLeft: 0,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    flexDirection: 'row'
  },
  sizeView: {
    paddingLeft: 0,
    borderBottomWidth: 0,
    paddingTop: 15
  },
  panelBrand: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    lineHeight: 24
  },
  panelTitle: {
    fontWeight: '400',
    fontSize: 12,
    color: '#666',
    lineHeight: 20
  },
  panelImage: {
    width: 60,
    height: 90,
    marginRight: 25
  }
})
