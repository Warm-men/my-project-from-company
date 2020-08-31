/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../image'
import p2d from '../../../../src/expand/tool/p2d'
import FreeServiceBanner from './free_password_banner'
export default class SubscriptionItem extends PureComponent {
  _didSelectedItem = () => {
    const { didSelectedItem, item, isSelected } = this.props
    !isSelected && didSelectedItem && didSelectedItem(item)
  }
  render() {
    const { item, isSelected, navigation } = this.props
    const {
      display_name,
      interval,
      base_price,
      original_price,
      operation_plan,
      description,
      auto_renew_discount_amount,
      preview
    } = item
    const url = isSelected
      ? require('../../../../assets/images/me_style/focus_button.png')
      : require('../../../../assets/images/me_style/blur_button.png')
    return (
      <View>
        <TouchableOpacity
          onPress={this._didSelectedItem}
          style={[styles.mainView, isSelected && styles.selectedView]}>
          <Image source={url} style={styles.selectedIcon} />
          <View>
            <View style={styles.nameView}>
              <Text style={styles.nameText}>
                {display_name}
                {interval === 1 ? '月卡' : interval === 3 ? '季卡' : '年卡'}
              </Text>
              {operation_plan && !!operation_plan.icon_v2_url && (
                <Image
                  style={[
                    styles.iconStyle,
                    {
                      height: 18,
                      width:
                        (operation_plan.icon_width /
                          operation_plan.icon_height) *
                        18
                    }
                  ]}
                  source={{ uri: operation_plan.icon_v2_url }}
                />
              )}
            </View>
            {description && <Text style={styles.titleText}>{description}</Text>}
          </View>
          <View style={styles.priceView}>
            <View style={styles.basePriceView}>
              <Text style={styles.basePrice}>￥</Text>
              <Text style={styles.basePriceNum}>{base_price}</Text>
            </View>
            {base_price !== original_price && (
              <Text style={styles.originalPrice}>￥{original_price}</Text>
            )}
          </View>
        </TouchableOpacity>
        {isSelected && (
          <FreeServiceBanner
            style={styles.openFreeService}
            autoRenewDiscountAmount={auto_renew_discount_amount}
            navigation={navigation}
            autoRenewDiscount={preview.auto_renew_discount}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainView: {
    borderRadius: 4,
    marginLeft: p2d(15),
    paddingHorizontal: p2d(10),
    marginBottom: p2d(10),
    height: p2d(64),
    width: p2d(345),
    backgroundColor: '#FFF',
    borderColor: '#d9d9d9',
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    flexDirection: 'row'
  },
  selectedIcon: {
    marginRight: p2d(10)
  },
  selectedView: {
    backgroundColor: '#f9eae8',
    borderColor: '#e85c40',
    zIndex: 9
  },
  nameView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameText: {
    fontSize: 16,
    color: '#242424',
    fontWeight: '600'
  },
  iconStyle: {
    marginLeft: p2d(4)
  },
  titleText: {
    fontSize: p2d(12),
    color: '#5e5e5e',
    marginTop: p2d(8)
  },
  priceView: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    right: p2d(20)
  },
  basePriceView: { flexDirection: 'row', alignItems: 'center' },
  basePrice: {
    fontSize: 14,
    color: '#242424'
  },
  basePriceNum: {
    color: '#242424',
    fontSize: 18,
    fontWeight: '700'
  },
  originalPrice: {
    fontSize: 12,
    color: '#989898',
    textDecorationLine: 'line-through'
  },
  openFreeService: {
    marginHorizontal: p2d(18),
    paddingRight: p2d(15),
    paddingLeft: p2d(5),
    marginBottom: 12,
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: '#d9d9d9',
    height: 64,
    marginTop: -13,
    backgroundColor: '#fdfbf6',
    marginBottom: 10
  }
})
