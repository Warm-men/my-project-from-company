/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import AddToClosetButton from '../../../src/containers/closet/add_to_closet_button'
import Image from '../image'
import { Column } from '../../../src/expand/tool/add_to_closet_status'
export default class LookbookProduct extends PureComponent {
  _getReportData = () => {
    const { navigation, data, index, column } = this.props
    const { id } = data
    if (index) {
      return {
        index,
        variables: { id },
        column: column ? column : Column.Lookbook,
        router: navigation.state.routeName
      }
    } else {
      return {
        variables: { id },
        column: column ? column : Column.Lookbook,
        router: navigation.state.routeName
      }
    }
  }
  _openProductDetail = () => {
    const { data, onPress } = this.props
    onPress && onPress(data)
  }
  render() {
    const { width, height } = StyleSheet.flatten(this.props.style)
    const {
      style,
      isAccessories,
      data,
      onPress,
      hideDesc,
      showCloset,
      useLookMainPhoto,
      containerStyle
    } = this.props
    if (!data) {
      return null
    }
    const { title, brand, look_photo, look_main_photo_v2 } = data
    let productImage = ''
    if (useLookMainPhoto) {
      productImage = look_main_photo_v2 ? look_main_photo_v2 : ''
    }
    if (!productImage && look_photo) {
      productImage = look_photo.url
    }

    return (
      <View style={containerStyle || styles.container}>
        <TouchableOpacity
          disabled={!onPress}
          style={style}
          onPress={this._openProductDetail}>
          <Image
            style={{ height, width }}
            qWidth={width * 2}
            defaultSource={{ uri: productImage, width: 240 }}
            source={{ uri: productImage }}
          />
        </TouchableOpacity>
        {!hideDesc && (
          <View
            style={[
              styles.center,
              isAccessories ? { width: (width * 3) / 2 } : { width }
            ]}>
            {!!showCloset && (
              <AddToClosetButton
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                getReportData={this._getReportData}
                product={data}
              />
            )}
            <View>
              <Text numberOfLines={1} style={styles.productName}>
                {title}
              </Text>
              {!!brand && (
                <Text numberOfLines={1} style={styles.brandName}>
                  {brand.name}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  center: {
    justifyContent: 'center',
    flexDirection: 'row'
  },
  row: { flexDirection: 'row' },
  productName: {
    height: 15,
    marginLeft: 6,
    fontSize: 12,
    color: '#242424'
  },
  brandName: {
    marginTop: 5,
    fontSize: 10,
    color: '#5E5E5E',
    marginLeft: 6
  }
})
