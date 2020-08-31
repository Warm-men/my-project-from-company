import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
export default class CouponItem extends PureComponent {
  returnTips = () => {
    const { item } = this.props
    const selectBar = item.status
    let tips = []
    item.rules.map((item, index) => {
      tips.push(
        <Text
          style={[
            styles.tipText,
            (selectBar && selectBar !== 'Valid') || item.disabled
              ? styles.huiE4
              : null
          ]}
          key={index}>
          {item}
        </Text>
      )
    })
    return tips
  }

  returnName = () => {
    const { item } = this.props
    const selectBar = item.status
    switch (item.type) {
      case 'MemberPromoCode':
        return (
          <View style={styles.moneyView}>
            <Text
              numberOfLines={1}
              style={[
                styles.moneyViewText,
                ((selectBar && selectBar !== 'Valid') || item.disabled) &&
                  styles.huiC7
              ]}>
              {item.discount_amount && (
                <Text style={{ fontSize: p2d(13) }}>￥</Text>
              )}
              {item.discount_amount}
            </Text>
          </View>
        )
      case 'DiscountPromoCode':
        return (
          <View style={styles.moneyView}>
            <Text
              numberOfLines={1}
              style={[
                styles.moneyViewText,
                ((selectBar && selectBar !== 'Valid') || item.disabled) &&
                  styles.huiC7
              ]}>
              {item.discount_amount && (
                <Text style={{ fontSize: p2d(13) }}>￥</Text>
              )}
              {item.discount_amount}
            </Text>
            {item.condition_display && (
              <Text
                style={[
                  styles.conditionDisplay,
                  ((selectBar && selectBar !== 'Valid') || item.disabled) &&
                    styles.huiC7
                ]}>
                {item.condition_display}
              </Text>
            )}
          </View>
        )
      case 'PercentPromoCode':
        return (
          <View style={styles.moneyView}>
            <Text
              numberOfLines={1}
              style={[
                styles.moneyViewText,
                ((selectBar && selectBar !== 'Valid') || item.disabled) &&
                  styles.huiC7
              ]}>
              {item.discount_percent && `${item.discount_percent / 10}`}
              <Text style={{ fontSize: p2d(13) }}>折</Text>
            </Text>
            {item.condition_display && (
              <Text
                style={[
                  styles.conditionDisplay,
                  ((selectBar && selectBar !== 'Valid') || item.disabled) &&
                    styles.huiC7
                ]}>
                {item.condition_display}
              </Text>
            )}
          </View>
        )
      case 'ClothingCoupon':
        return (
          <View style={styles.moneyView}>
            <Text
              numberOfLines={1}
              style={[
                styles.moneyViewText,
                ((selectBar && selectBar !== 'Valid') || item.disabled) &&
                  styles.huiC7
              ]}>
              <Text style={{ fontSize: p2d(16) }}>+</Text>1
            </Text>
          </View>
        )
    }
  }

  returnProductScope = () => {
    const { product_scope } = this.props.item
    if (product_scope === 'All') {
      return '商品'
    } else if (product_scope === 'Clothing') {
      return '衣服'
    } else {
      return '配饰'
    }
  }

  render() {
    const {
      item,
      usedTime,
      expiredTime,
      onPress,
      hideDiffAmount,
      isUsed
    } = this.props
    const selectBar = item.status
    const showTips =
      item.rules.length > 0 || (!!item.diff_amount && !!item.product_scope)
    const showTime = (isUsed && usedTime) || expiredTime
    return (
      <View style={styles.flatItem}>
        <View style={styles.couponContainer}>
          {this.returnName()}
          <View style={styles.couponExplainView}>
            <Text
              style={[
                styles.couponName,
                (selectBar && selectBar !== 'Valid') || item.disabled
                  ? styles.huiC7
                  : null
              ]}>
              {item.title}
              {item.sub_title && (
                <Text
                  testID="sub-title"
                  style={[
                    styles.subTitle,
                    (selectBar && selectBar !== 'Valid') || item.disabled
                      ? styles.huiC7
                      : null
                  ]}>
                  {`  ${item.sub_title}`}
                </Text>
              )}
            </Text>
            {showTime && (
              <Text
                testID="time"
                style={[
                  styles.couponTime,
                  (selectBar && selectBar !== 'Valid') || item.disabled
                    ? styles.huiE4
                    : null
                ]}>
                {isUsed ? `使用日期：` : `有效期至`}
                {isUsed ? usedTime : expiredTime}
              </Text>
            )}
          </View>
          <View style={styles.couponTailView}>{onPress(item)}</View>
        </View>
        {showTips && (
          <View>
            <View style={styles.rulesView}>
              <View style={[styles.grayCircle, { marginLeft: -10 }]} />
              <View style={[styles.grayCircle, { marginRight: -10 }]} />
            </View>
            <View style={styles.rulesContainerView}>
              {!!item.diff_amount && !!item.product_scope && !hideDiffAmount && (
                <Text style={styles.tipText}>
                  再买
                  <Text style={styles.redTipText}>{item.diff_amount}元</Text>
                  {this.returnProductScope()}
                  可用该券
                </Text>
              )}

              {item.rules.length > 0 && (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.tipText, { marginRight: 6 }]}>
                    使用须知:
                  </Text>
                  <View style={{ flex: 1 }}>{this.returnTips()}</View>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  flatItem: {
    flex: 1
  },
  couponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: p2d(345),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ECECEC'
  },
  moneyView: {
    height: p2d(80),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: p2d(8),
    width: p2d(70)
  },
  moneyViewText: {
    fontSize: p2d(24),
    color: '#EA5C39',
    textAlign: 'center'
  },
  couponExplainView: {
    justifyContent: 'center',
    marginLeft: 15,
    flex: 1,
    marginRight: p2d(10)
  },
  couponName: {
    fontSize: p2d(14),
    color: '#333',
    marginBottom: p2d(10)
  },
  subTitle: {
    fontSize: 12,
    color: '#333'
  },
  conditionDisplay: {
    fontSize: p2d(11),
    color: '#EA5C39'
  },
  couponTime: {
    fontSize: p2d(11),
    color: '#999'
  },
  couponTailView: {
    justifyContent: 'center'
  },
  grayCircle: {
    height: 20,
    width: 20,
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#ECECEC',
    marginTop: -10
  },
  tipText: {
    fontSize: 11,
    color: '#B9B9B9',
    lineHeight: 18
  },
  redTipText: {
    color: '#e85c40'
  },
  rulesView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FCFCFC'
  },
  rulesContainerView: {
    flex: 1,
    backgroundColor: '#FCFCFC',
    borderWidth: 1,
    borderColor: '#ECECEC',
    width: p2d(345),
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 7,
    borderTopWidth: 0
  },
  huiC7: {
    color: '#C7C7C7'
  },
  huiE4: {
    color: '#E4E4E4'
  }
})
