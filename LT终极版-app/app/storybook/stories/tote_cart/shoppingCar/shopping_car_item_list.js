import React, { PureComponent } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Icons from 'react-native-vector-icons/Ionicons'
import Image from '../../image'
import p2d from '../../../../src/expand/tool/p2d'
import { Column } from '../../../../src/expand/tool/add_to_closet_status'
import {
  getDisplaySizeName,
  getProductAbnormalStatus
} from '../../../../src/expand/tool/product_l10n'
import ToteSlot from '../../products/tote_slot'
import { differenceInMinutes } from 'date-fns'
export default class ShoppingCarItemList extends PureComponent {
  onPressProduct = item => {
    const column = Column.ShoppingCar
    this.props.navigation.push('Details', { item, column })
  }
  _didSelectedItem = () => {
    const { didSelectedItem, type } = this.props
    didSelectedItem && didSelectedItem(type)
  }

  _renderItem = () => {
    const {
      maxCount,
      products,
      nowCount,
      column,
      removeFromToteCart
    } = this.props
    let array = []
    products.map(item => {
      array.push(
        <Item
          key={item.id}
          item={item}
          column={column}
          onPressProduct={this.onPressProduct}
          removeFromToteCart={removeFromToteCart}
        />
      )
    })
    const nullViewNum = maxCount - nowCount
    if (nullViewNum > 0) {
      for (let index = 0; index < nullViewNum; index++) {
        const uri =
          column === '衣服'
            ? require('../../../../assets/images/totes/nullClothingView.png')
            : require('../../../../assets/images/totes/nullAccessoryView.png')
        array.push(
          <TouchableOpacity
            key={index}
            testID="empty-item"
            style={styles.itemView}
            onPress={this._didSelectedItem}>
            <Image style={styles.itemImage} source={uri} resizeMode="contain" />
          </TouchableOpacity>
        )
      }
    }
    return array
  }

  returnCouponTips = () => {
    const { customerCouponId, couponStore } = this.props
    if (customerCouponId) {
      return `已使用加衣券，增加1个衣位`
    } else {
      let willExpire = couponStore.validCoupons.filter(item => {
        const days =
          differenceInMinutes(new Date(item.expired_at), new Date()) / (24 * 60)
        return days <= 15
      })
      if (!willExpire.length) {
        return `你有${couponStore.validCoupons.length}张加衣券可使用`
      } else {
        return `你有${willExpire.length}张加衣券即将过期`
      }
    }
  }

  render() {
    const {
      column,
      maxCount,
      nowCount,
      customerCouponId,
      couponStore,
      operationCoupon,
      style
    } = this.props
    const isClothing = column === '衣服'
    return (
      <View style={[styles.columnComponent, style]}>
        <View style={styles.columnTitleView}>
          <Text style={styles.columnLeftTitle}>
            <Text style={styles.column}>{column}</Text>
            <Text style={styles.redText}>
              {' '}
              ({nowCount}/{maxCount})
            </Text>
          </Text>
        </View>
        {isClothing && !!couponStore.validCoupons.length && (
          <View style={[styles.couponTips, styles.couponTipsBackground]}>
            <Image
              style={styles.couponTipsBackground}
              source={require('../../../../assets/images/totes/coupon_background.png')}
            />
            <View
              style={[styles.couponTipsContent, styles.couponTipsBackground]}>
              <Text
                style={styles.couponTipsLeftTitle}
                testID="couponTipsLeftTitle">
                {this.returnCouponTips()}
              </Text>
              <TouchableOpacity
                style={styles.couponTipsRightView}
                onPress={operationCoupon}>
                <Text
                  style={[
                    styles.couponTipsRightViewTitle,
                    customerCouponId && { color: '#5e5e5e', fontWeight: '700' }
                  ]}>
                  {customerCouponId ? '取消使用' : '立即使用'}
                </Text>
                <Icons
                  name={'ios-arrow-forward'}
                  size={14}
                  color={customerCouponId ? '#5e5e5e' : '#E85C40'}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.itemComponent}>{this._renderItem()}</View>
      </View>
    )
  }
}

class Item extends PureComponent {
  _onPressProduct = () => {
    const { onPressProduct, item } = this.props
    onPressProduct && onPressProduct(item.product)
  }

  _removeFromToteCart = () => {
    const { removeFromToteCart, item } = this.props
    removeFromToteCart && removeFromToteCart(item)
  }

  render() {
    const { column, item } = this.props
    const isClothing = column === '衣服'
    const { product, product_size, id } = item
    const tips = getProductAbnormalStatus(product, product_size)
    const showToteSlot = product.tote_slot >= 2

    const sizeName = getDisplaySizeName(product_size.size_abbreviation)
    return (
      <TouchableOpacity
        onPress={this._onPressProduct}
        key={id}
        delayPressIn={100}
        style={styles.itemView}>
        <View style={{ backgroundColor: '#fff', opacity: !!tips ? 0.5 : 1 }}>
          <Image
            style={styles.itemImage}
            source={{ uri: product.catalogue_photos[0].medium_url }}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity
          style={styles.iconView}
          onPress={this._removeFromToteCart}>
          <Icons
            style={styles.icon}
            name={'ios-close-circle-outline'}
            size={20}
            color={'#ccc'}
          />
        </TouchableOpacity>
        {isClothing && (
          <View style={styles.sizeTips}>
            <Text style={styles.sizeTipsTitle}>{sizeName}</Text>
          </View>
        )}
        {!!tips && (
          <View style={[styles.itemImage, styles.swappableView]}>
            <View style={styles.swappableTips}>
              <Text style={styles.swappableTipsTitle}>{tips}</Text>
            </View>
          </View>
        )}
        {showToteSlot && (
          <ToteSlot
            style={styles.toteSlot}
            slotNum={product.tote_slot}
            type={product.type}
          />
        )}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  columnComponent: {
    marginTop: p2d(16)
  },
  columnTitleView: {
    flexDirection: 'row',
    marginBottom: p2d(12),
    marginHorizontal: p2d(6),
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  columnLeftTitle: {
    fontSize: 14,
    color: '#333'
  },
  redText: {
    color: '#5e5e5e'
  },
  column: {
    fontSize: 16,
    fontWeight: '600'
  },
  columnRightTitle: {
    fontSize: 13,
    color: '#999'
  },
  itemComponent: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  itemView: {
    width: p2d(106),
    height: p2d(159),
    marginHorizontal: p2d(6),
    marginBottom: p2d(12),
    alignItems: 'center'
  },
  itemImage: {
    width: p2d(106),
    height: p2d(159)
  },
  iconView: {
    position: 'absolute',
    right: 0,
    height: 40,
    width: 40,
    zIndex: 2
  },
  icon: {
    position: 'absolute',
    top: 5,
    right: 5
  },
  sizeTips: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#F2BE7D',
    bottom: 0,
    position: 'absolute',
    opacity: 0.95,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sizeTipsTitle: {
    fontSize: 11,
    color: '#fff'
  },
  swappableView: {
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  swappableTips: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#333',
    opacity: 0.6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  swappableTipsTitle: {
    color: '#FFF',
    fontSize: 11
  },
  couponTips: {
    alignSelf: 'center',
    marginBottom: 16
  },
  couponTipsContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: p2d(12)
  },
  couponTipsBackground: {
    width: p2d(343),
    height: 40
  },
  couponTipsLeftTitle: {
    color: '#242424',
    fontSize: 14
  },
  couponTipsRightView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  couponTipsRightViewTitle: {
    color: '#E85C40',
    fontSize: 14,
    marginRight: 8
  },
  toteSlot: {
    position: 'absolute',
    top: 5,
    left: 0
  }
})
