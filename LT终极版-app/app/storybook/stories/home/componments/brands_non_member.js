/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../image'
import p2d from '../../../../src/expand/tool/p2d'
import { Column } from '../../../../src/expand/tool/add_to_closet_status'
import { NonMemberCommonTitle } from '../titleView'

export default class BrandsNonMember extends PureComponent {
  render() {
    const { extraData, titleText, didSelectedBrandItem, moreBrand } = this.props
    return (
      <View style={styles.activityBannerView}>
        <NonMemberCommonTitle title={titleText} />
        <View style={styles.imageView}>
          {extraData &&
            extraData.map((item, index) => {
              if (index > 8) {
                return
              }
              return (
                <BrandItem
                  onPress={didSelectedBrandItem}
                  data={item}
                  key={index}
                />
              )
            })}
        </View>
        <TouchableOpacity onPress={moreBrand} style={styles.moreBrandsButton}>
          <Text style={styles.moreBrandText}>{'查看全部品牌'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class BrandItem extends PureComponent {
  _onPress = () => {
    const { data, onPress } = this.props
    onPress && onPress(data.link)
  }
  render() {
    const { data } = this.props
    const url =
      typeof data.image_url === 'number'
        ? data.image_url
        : { uri: data.image_url }
    return (
      <TouchableOpacity
        onPress={this._onPress}
        delayPressIn={100}
        activeOpacity={0.85}>
        <Image
          description={Column.Brand + '-' + data.id}
          source={url}
          style={styles.imageStyle}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  activityBannerView: {
    marginTop: p2d(34),
    marginBottom: p2d(30)
  },
  imageView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: p2d(16),
    justifyContent: 'space-between'
  },
  imageStyle: {
    width: p2d(109),
    height: p2d(82),
    marginBottom: p2d(8)
  },
  moreBrandsButton: {
    marginHorizontal: p2d(16),
    height: p2d(50),
    borderWidth: 1,
    borderColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: p2d(8)
  },
  moreBrandText: {
    fontSize: 14,
    color: '#242424'
  }
})
