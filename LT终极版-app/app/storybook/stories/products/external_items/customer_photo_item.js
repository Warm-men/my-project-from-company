import React, { PureComponent } from 'react'
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Platform
} from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'

export default class CustomerPhotoItem extends PureComponent {
  constructor(props) {
    super(props)
    const { index, numColumns } = props
    this.isRightView = index % numColumns
  }

  _didSelectedItem = () => {
    const { didSelectedItem, index, data } = this.props
    didSelectedItem && didSelectedItem(data, index)
  }
  render() {
    const { style, index, data, didSelectedItem } = this.props
    const { product } = data.products[0]
    const { roles } = data.customer
    const is_stylist = roles.find(item => {
      return item.type === 'stylist'
    })
    const uri = !!is_stylist
      ? require('../../../../assets/images/product_list/sytlist_customer_photo.png')
      : require('../../../../assets/images/product_list/customer_photo.png')
    const topStyle = {
      width: style.width - 1,
      height: (style.width * 3) / 2,
      paddingHorizontal: 8,
      paddingVertical: 3,
      marginTop: 5
    }
    const imageStyle = {
      width: topStyle.width - 16,
      height: ((topStyle.width - 16) * 3) / 2,
      borderRadius: 4
    }
    const imageTagStyle = {
      position: 'absolute',
      top: imageStyle.height - 18,
      left: 16
    }

    return (
      <TouchableOpacity
        onPress={this._didSelectedItem}
        delayPressIn={Platform.OS === 'android' ? 0 : 50}
        activeOpacity={didSelectedItem ? 0.6 : 1}
        style={[
          style,
          this.isRightView ? styles.rightView : styles.leftView,
          index < 2 && { borderTopWidth: 1 }
        ]}>
        <View style={topStyle}>
          <Image
            style={imageStyle}
            source={{ uri: data.photos[0].mobile_url }}
          />
          <Image style={imageTagStyle} source={uri} />
        </View>
        <View style={styles.bottomView}>
          {product.brand && (
            <Text numberOfLines={1} style={styles.brand}>
              {product.brand.name}
            </Text>
          )}
          <View style={styles.titleView}>
            <Text numberOfLines={1} style={styles.title}>
              {product.title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  leftView: {
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#f7f7f7'
  },
  rightView: { borderBottomWidth: 1, borderColor: '#f7f7f7' },

  bottomView: { flex: 1, paddingHorizontal: p2d(16) },
  brand: {
    paddingTop: p2d(12, { maxLock: true }),
    fontSize: p2d(14, { minLock: true }),
    color: '#333'
  },
  titleView: { flexDirection: 'row', justifyContent: 'space-between' },
  title: {
    fontSize: p2d(12, { minLock: true }),
    lineHeight: 28,
    color: '#999'
  }
})
