/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../../../storybook/stories/image'
import p2d from '../../../../src/expand/tool/p2d'
import FreeServiceBanner from './free_service_banner'

class TestAItem extends PureComponent {
  returnBasePrice = () => {
    const { enablePaymentContract, item, isSelectedFreeService } = this.props
    const { base_price, auto_renew_discount_amount, preview } = item
    if (isSelectedFreeService && !enablePaymentContract.length) {
      return base_price - auto_renew_discount_amount
    } else if (enablePaymentContract && !!enablePaymentContract.length) {
      return base_price - preview.auto_renew_discount
    } else {
      return base_price
    }
  }

  render() {
    const {
      item,
      isSelected,
      didSelectedItem,
      didSelectedFreeService,
      isSelectedFreeService
    } = this.props
    const {
      display_name,
      interval,
      original_price,
      operation_plan,
      description,
      auto_renew_discount_amount,
      preview
    } = item
    const basePrice = this.returnBasePrice()
    const showOriginalPrice = basePrice !== original_price
    return (
      <View>
        <TouchableOpacity
          onPress={didSelectedItem}
          style={[styles.mainView, isSelected && styles.selectedView]}>
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
              <Text style={styles.basePriceNum}>{basePrice}</Text>
            </View>
            {showOriginalPrice && (
              <Text style={styles.originalPrice}>￥{original_price}</Text>
            )}
          </View>
        </TouchableOpacity>
        {isSelected && (
          <FreeServiceBanner
            didSelectedFreeService={didSelectedFreeService}
            autoRenewDiscountAmount={auto_renew_discount_amount}
            autoRenewDiscount={preview.auto_renew_discount}
            isSelected={isSelectedFreeService}
          />
        )}
      </View>
    )
  }
}

class TestBItem extends PureComponent {
  render() {
    const {
      item,
      didSelectedItem,
      index,
      isSelectedFreeService,
      isSelected,
      enablePaymentContract
    } = this.props
    return (
      <View>
        {!index &&
          item.auto_renew_discount_amount &&
          !enablePaymentContract.length && (
            <ItemContainer
              item={item}
              isSelected={isSelected}
              isSelectedFreeService={isSelectedFreeService}
              didSelectedItem={didSelectedItem}
              type={'header'}
              index={index}
              enablePaymentContract={enablePaymentContract}
            />
          )}
        <ItemContainer
          item={item}
          isSelected={this.props.isSelected}
          isSelectedFreeService={isSelectedFreeService}
          didSelectedItem={didSelectedItem}
          index={index}
          enablePaymentContract={enablePaymentContract}
        />
      </View>
    )
  }
}

class ItemContainer extends PureComponent {
  didSelectedItem = () => {
    const { type, didSelectedItem } = this.props
    didSelectedItem(type)
  }

  returnIsSelected = () => {
    const {
      isSelectedFreeService,
      type,
      isSelected,
      item: { interval },
      enablePaymentContract
    } = this.props
    if (type === 'header') {
      return isSelectedFreeService
    } else {
      if (interval === 1 && !enablePaymentContract.length) {
        return isSelectedFreeService ? false : isSelected
      } else {
        return isSelected
      }
    }
  }

  returnTips = () => {
    const { item, type } = this.props
    const { operation_plan } = item
    if (type === 'header') {
      return (
        <View style={styles.tipsIconView}>
          <Text style={styles.tipsIconViewText}>自动续费</Text>
        </View>
      )
    } else if (operation_plan && !!operation_plan.icon_v2_url) {
      return (
        <Image
          style={[
            styles.iconStyle,
            {
              height: 18,
              width:
                (operation_plan.icon_width / operation_plan.icon_height) * 18
            }
          ]}
          source={{ uri: operation_plan.icon_v2_url }}
        />
      )
    }
  }

  returnBasePrice = () => {
    const { type, enablePaymentContract, item } = this.props
    const { base_price, auto_renew_discount_amount, preview } = item
    if (type === 'header') {
      return base_price - auto_renew_discount_amount
    } else if (enablePaymentContract && !!enablePaymentContract.length) {
      return base_price - preview.auto_renew_discount
    } else {
      return base_price
    }
  }

  render() {
    const { item, type, enablePaymentContract } = this.props
    const {
      display_name,
      interval,
      original_price,
      description,
      preview
    } = item
    const isSelected = this.returnIsSelected()
    const isContract = enablePaymentContract && !!enablePaymentContract.length
    const basePrice = this.returnBasePrice()
    const showOriginalPrice = basePrice !== original_price
    const url = isContract
      ? null
      : isSelected
      ? require('../../../../assets/images/me_style/focus_button.png')
      : require('../../../../assets/images/me_style/blur_button.png')
    return (
      <View>
        <TouchableOpacity
          onPress={this.didSelectedItem}
          style={[styles.mainView, isSelected && styles.selectedView]}>
          {url && <Image source={url} style={styles.selectedIcon} />}
          <View>
            <View style={styles.nameView}>
              <Text style={styles.nameText}>
                {display_name}
                {type === 'header'
                  ? `连续包月`
                  : interval === 1
                  ? '月卡'
                  : interval === 3
                  ? '季卡'
                  : '年卡'}
              </Text>
              {this.returnTips()}
            </View>
            {description && <Text style={styles.titleText}>{description}</Text>}
          </View>
          <View style={styles.priceView}>
            <View style={styles.basePriceView}>
              <Text style={styles.basePrice}>￥</Text>
              <Text style={styles.basePriceNum}>{basePrice}</Text>
            </View>
            {showOriginalPrice && (
              <Text style={styles.originalPrice}>￥{original_price}</Text>
            )}
          </View>
        </TouchableOpacity>
        {isSelected && (
          <FreeServiceBanner autoRenewDiscount={preview.auto_renew_discount} />
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
  tipsIconView: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderColor: '#e71f19',
    borderWidth: 0.5,
    marginLeft: 4
  },
  tipsIconViewText: {
    fontSize: 12,
    color: '#e85c40'
  }
})

export { TestAItem, TestBItem }
