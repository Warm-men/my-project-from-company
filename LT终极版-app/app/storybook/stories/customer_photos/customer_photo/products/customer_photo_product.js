/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Image from '../../../image'
import AddToClosetButton from '../../../../../src/containers/closet/add_to_closet_button'
import {
  l10nForSize,
  getProductAbnormalStatus
} from '../../../../../src/expand/tool/product_l10n'

export default class CustomerPhotoProduct extends PureComponent {
  _onClick = () => {
    const { didSelectedItem, data } = this.props
    didSelectedItem(data.product)
  }
  render() {
    const { getReportData, data, updateClosetStatus } = this.props
    const { product, product_size } = data
    const { catalogue_photos, title, brand } = product
    const abnormalStatus = getProductAbnormalStatus(product)
    return (
      <TouchableOpacity style={styles.container} onPress={this._onClick}>
        <Image
          style={styles.image}
          source={{
            uri:
              catalogue_photos &&
              catalogue_photos[0] &&
              catalogue_photos[0].medium_url
          }}
        />
        {!!abnormalStatus && (
          <View style={[styles.image, styles.abnormalStatus]}>
            <View style={styles.abnormalStatusView}>
              <Text style={styles.abnormalStatusTitle}>{abnormalStatus}</Text>
            </View>
          </View>
        )}
        <View style={styles.contentView}>
          <Text style={styles.title}>{brand && brand.name}</Text>
          <Text style={styles.brand}>{title}</Text>
          {!!product_size && (
            <Text style={styles.size}>
              {l10nForSize(product_size.size_abbreviation)}
            </Text>
          )}
        </View>
        <AddToClosetButton
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          getReportData={getReportData}
          buttonStyle={styles.closetButton}
          product={product}
          updateClosetStatus={updateClosetStatus}
        />
      </TouchableOpacity>
    )
  }
}

CustomerPhotoProduct.defaultProps = {
  data: {
    product: {
      catalogue_photos: { medium_url: '商品图片链接' },
      title: '商品名称',
      brand: { name: '品牌名称' }
    },
    product_size: { size_abbreviation: '尺码大小' }
  },
  didSelectedItem: () => {}
}

CustomerPhotoProduct.propTypes = {
  data: PropTypes.object
}

const styles = StyleSheet.create({
  container: {
    width: 223,
    height: 75,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 4,
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#f7f7f7'
  },
  image: { width: 49, height: 73, backgroundColor: '#f3f3f3' },
  contentView: { flex: 1, justifyContent: 'center', paddingLeft: 10 },
  title: { fontSize: 12, fontWeight: '500', color: '#242424', lineHeight: 18 },
  brand: { fontSize: 10, fontWeight: '400', color: '#989898', lineHeight: 16 },
  size: { fontSize: 10, fontWeight: '400', color: '#989898', lineHeight: 16 },
  closetButton: { marginRight: 15 },
  abnormalStatus: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  abnormalStatusView: {
    height: 18,
    width: 44,
    backgroundColor: 'rgba(51,51,51,0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  abnormalStatusTitle: {
    fontSize: 11,
    color: '#fff'
  }
})
