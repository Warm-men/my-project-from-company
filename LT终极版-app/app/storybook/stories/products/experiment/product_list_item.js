/* @flow */

import React, { PureComponent, Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Text,
  Image
} from 'react-native'
import AddToClosetButton from '../../../../src/containers/closet/add_to_closet_button'
import { getProductAbnormalStatus } from '../../../../src/expand/tool/product_l10n'
import p2d from '../../../../src/expand/tool/p2d'
import { updateViewableItemStatus } from '../../../../src/expand/tool/daq'
import ToteSlot from '../tote_slot'
import Feed from './feed'
import { inject, observer } from 'mobx-react'
import Images from './images'

class ProductItem extends PureComponent {
  constructor(props) {
    super(props)
    const { index, numColumns } = props
    this.isRightView = index % numColumns
  }
  _didSelectedItem = () => {
    const { didSelectedItem, product, index } = this.props
    didSelectedItem && didSelectedItem(product, index)
  }
  _updateClosetStatus = (id, isAddToCloset, data) => {
    const { currentKey } = this.props
    if (isAddToCloset) {
      updateViewableItemStatus(currentKey, { id, closet: true }, data)
    }
  }
  _getReportData = () => {
    const { getReportData, index } = this.props
    return getReportData && getReportData(index)
  }

  returnSeasonSampleTips = () => {
    const { season_sample } = this.props.product
    let seasonSampleTips
    switch (season_sample) {
      case 'spring_sample':
        seasonSampleTips = `春季单品`
        break
      case 'summer_sample':
        seasonSampleTips = `夏季单品`
        break
      case 'fall_sample':
        seasonSampleTips = `秋季单品`
        break
      case 'winter_sample':
        seasonSampleTips = `冬季单品`
        break
    }
    return seasonSampleTips
  }

  render() {
    const {
      product,
      didSelectedItem,
      style,
      index,
      isSubscriber,
      addShoppingCarButton,
      toteCartAddProduct,
      hiddenImage,
      currentKey,
      isViewableFeed,
      isViewableImageAnimated,
      isViewableSeasonSample
    } = this.props

    const {
      brand,
      catalogue_photos,
      title,
      feed,
      id,
      swappable,
      disabled,
      category
    } = product
    const abnormal = !swappable || disabled
    const images =
      catalogue_photos && catalogue_photos.length ? catalogue_photos : []

    const showToteSlot = product.tote_slot >= 2
    const swappableTitle = getProductAbnormalStatus(product)

    const imageStyle = { width: style.width - 1, height: (style.width * 3) / 2 }
    const seasonSampleTips = isViewableSeasonSample
      ? this.returnSeasonSampleTips()
      : null
    return (
      <TouchableOpacity
        style={[
          style,
          this.isRightView ? styles.rightView : styles.leftView,
          index < 2 && { borderTopWidth: 1 }
        ]}
        delayPressIn={Platform.OS === 'android' ? 0 : 50}
        activeOpacity={didSelectedItem ? 0.6 : 1}
        onPress={this._didSelectedItem}>
        <View style={[styles.imageView, imageStyle]}>
          {!hiddenImage ? (
            <View>
              <Images
                id={id}
                data={images}
                category={category}
                abnormal={abnormal}
                style={imageStyle}
                showToteSlot={showToteSlot}
                isViewableImageAnimated={isViewableImageAnimated}
              />
              {seasonSampleTips && (
                <SeasonSampleTips seasonSampleTips={seasonSampleTips} />
              )}
            </View>
          ) : null}
          {isViewableFeed && !abnormal ? (
            <Feed id={id} data={feed} index={index} abnormal={abnormal} />
          ) : null}
        </View>
        <View style={styles.bottomView}>
          {!isSubscriber && <NonSubscriberTip price={product.full_price} />}
          {brand && (
            <Text numberOfLines={1} style={styles.brand}>
              {brand.name}
            </Text>
          )}
          <View style={styles.titleView}>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
            {addShoppingCarButton && (
              <AddShoppingCarButton
                getReportData={this._getReportData}
                toteCartAddProduct={toteCartAddProduct}
                product={product}
                index={index}
                currentKey={currentKey}
              />
            )}
          </View>
        </View>
        {!!swappableTitle && (
          <View style={[imageStyle, styles.abnormalStatus]}>
            <View style={styles.abnormalStatusView}>
              <Text style={styles.abnormalStatusTitle}>{swappableTitle}</Text>
            </View>
          </View>
        )}
        <AddToClosetButton
          getReportData={this._getReportData}
          buttonStyle={styles.closetButton}
          product={product}
          updateClosetStatus={this._updateClosetStatus}
        />
        {showToteSlot && (
          <ToteSlot
            slotNum={product.tote_slot}
            style={styles.toteSlot}
            type={product.type}
          />
        )}
      </TouchableOpacity>
    )
  }
}

class NonSubscriberTip extends PureComponent {
  render() {
    const { price } = this.props
    return (
      <View style={styles.nonSubscriberTip}>
        <Text style={styles.nonSubscriberTipTitle}>会员免费穿</Text>
        <Text style={styles.nonSubscriberTipPrice}>¥{price}</Text>
      </View>
    )
  }
}

class SeasonSampleTips extends PureComponent {
  render() {
    const { seasonSampleTips } = this.props
    return (
      <View style={styles.seasonSampleTipsView}>
        <Text style={styles.seasonSampleTipsText}>{seasonSampleTips}</Text>
      </View>
    )
  }
}

@inject('toteCartStore')
@observer
class AddShoppingCarButton extends Component {
  _toteCartAddProduct = () => {
    const {
      toteCartAddProduct,
      product,
      index,
      getReportData,
      currentKey
    } = this.props
    toteCartAddProduct && toteCartAddProduct(product, index)

    //DAQ
    const data = getReportData()
    const { id } = product
    updateViewableItemStatus(currentKey, { id, addToShoppingCar: true }, data)
  }

  _isProductInToteCart = () => {
    const {
      product,
      toteCartStore: { toteCart }
    } = this.props
    if (!toteCart || !product) return false
    const { accessory_items, clothing_items } = toteCart
    const products =
      product.type === 'Clothing' ? clothing_items : accessory_items
    if (products.length) {
      const index = products.findIndex(item => item.product.id === product.id)
      if (index > -1) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  render() {
    const { product } = this.props
    const isSwappable = product.swappable
    const isProductInToteCart = this._isProductInToteCart()

    const uri = isProductInToteCart
      ? require('../../../../assets/images/totes/in_tote_cart_icon.png')
      : isSwappable
      ? require('../../../../assets/images/totes/add_shoppingCar.png')
      : require('../../../../assets/images/closet/non_add_shoppingCar.png')
    return (
      <TouchableOpacity
        style={styles.addShoppingCarButton}
        hitSlop={styles.buttonHitSlop}
        disabled={!isSwappable}
        onPress={this._toteCartAddProduct}>
        <Image style={styles.addShoppingCarButtonImage} source={uri} />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  imageView: { marginTop: 5 },
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
  titleView: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  title: {
    fontSize: p2d(12, { minLock: true }),
    lineHeight: 28,
    color: '#999',
    maxWidth: '80%'
  },
  addShoppingCarButton: { width: 28, height: 28, borderRadius: 14 },
  addShoppingCarButtonImage: { width: 28, height: 28 },
  buttonHitSlop: { top: 20, left: 20, right: 20, bottom: 20 },

  closetButton: { position: 'absolute', top: 4, right: 6, padding: 10 },
  toteSlot: { position: 'absolute', left: 16, top: 14 },

  abnormalStatus: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
    top: 5,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  abnormalStatusView: {
    height: 18,
    width: 50,
    backgroundColor: 'rgba(51,51,51,0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  abnormalStatusTitle: { fontSize: 11, color: '#fff' },

  nonSubscriberTip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 13,
    height: 20
  },
  nonSubscriberTipTitle: {
    backgroundColor: '#C1A15E',
    color: '#fff',
    overflow: 'hidden',
    borderRadius: 4,
    fontSize: 12,
    padding: 3
  },
  nonSubscriberTipPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through'
  },
  seasonSampleTipsView: {
    position: 'absolute',
    backgroundColor: '#FEF0EB',
    paddingHorizontal: 6,
    paddingVertical: 4,
    bottom: 0,
    left: 16,
    borderRadius: 2
  },
  seasonSampleTipsText: {
    fontSize: 11,
    color: '#FD6D3F'
  }
})

ProductItem.defaultProps = {
  numColumns: 2
}
export default ProductItem
