/* @flow */

import React, { Component, PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar/index.js'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services.js'
import { inject, observer } from 'mobx-react'
import p2d from '../../expand/tool/p2d'
import Image from '../../../storybook/stories/image'
import {
  l10nChartSize,
  l10nForSizeUI
} from '../../../src/expand/tool/product_l10n'
import { COUNT_BUST_SIZE } from '../../expand/tool/size/calSize'

@inject('currentCustomerStore')
@observer
export default class SizeChart extends Component {
  constructor(props) {
    super(props)
    const { productSizes } = this.props.navigation.state.params
    const size = productSizes[0] ? productSizes[0].size : null
    this.sizesKeysArr = []
    if (productSizes[0]) {
      const {
        size_abbreviation,
        shoulder,
        bust,
        waist,
        hip,
        front_length,
        back_length,
        inseam
      } = productSizes[0]
      size_abbreviation && this.sizesKeysArr.push({ title: '尺码', unit: ' ' })
      shoulder && this.sizesKeysArr.push({ title: '肩宽', unit: 'cm' })
      bust && this.sizesKeysArr.push({ title: '胸围', unit: 'cm' })
      waist && this.sizesKeysArr.push({ title: '腰围', unit: 'cm' })
      hip && this.sizesKeysArr.push({ title: '臀围', unit: 'cm' })
      inseam && this.sizesKeysArr.push({ title: '内腿长', unit: 'cm' })
      front_length && this.sizesKeysArr.push({ title: '前衣长', unit: 'cm' })
      back_length && this.sizesKeysArr.push({ title: '后衣长', unit: 'cm' })
    }

    this.signArr = [
      { title: '身高', unit: 'cm' },
      { title: '体重', unit: 'kg' },
      { title: '上胸围', unit: 'cm' },
      { title: '肩宽', unit: 'cm' },
      { title: '腰围', unit: 'cm' },
      { title: '臀围', unit: 'cm' },
      { title: '内腿长', unit: 'cm' }
    ]
    this.sizeType = null
    if (size) {
      this.sizeType = l10nChartSize(size.abbreviation)
        ? l10nChartSize(size.abbreviation).type
        : null
    }
    const { realtimeRecommendedSize } = this.props.navigation.state.params
    this.state = {
      inTolerance: false,
      realtimeRecommendedSize
    }
  }

  _getRealtimeRecommendedSizeAndSizeFitMessage = () => {
    const id = this.props.navigation.state.params.id
    QNetwork(
      SERVICE_TYPES.products.QUERY_REALTIME_RECOMMENDED_SIZE_AND_PRODUCT_SIZES,
      { id },
      response => {
        const {
          recommended_size
        } = response.data.realtime_product_recommended_size_and_product_sizes
        this.setState({ realtimeRecommendedSize: recommended_size })
      }
    )
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }
  _editSize = () => {
    const { currentCustomerStore } = this.props
    if (!currentCustomerStore.id) {
      currentCustomerStore.setLoginModalVisible(true)
      return
    }
    const { height_inches, weight, bra_size } = currentCustomerStore.style
    if (!height_inches || !weight || !bra_size) {
      this.props.navigation.navigate('BasicSize', {
        onRefreshSizeChart: this._getRealtimeRecommendedSizeAndSizeFitMessage
      })
      return
    }
    this.props.navigation.navigate('OnlyStyle', {
      styleIncomplete: true,
      onRefreshSizeChart: this._getRealtimeRecommendedSizeAndSizeFitMessage
    })
  }
  _checkInTolerance = inTolerance => {
    this.setState({ inTolerance })
  }
  render() {
    const { style } = this.props.currentCustomerStore
    const {
      bra_size,
      cup_size,
      height_inches,
      hip_size_inches,
      inseam,
      waist_size,
      weight,
      shoulder_size,
      bust_size_number
    } = style
    const bustSizeNumber = COUNT_BUST_SIZE(bra_size, cup_size)
    const bust = bust_size_number ? bust_size_number : bustSizeNumber
    const myStyles = [
      height_inches,
      weight,
      bust_size_number,
      shoulder_size,
      waist_size,
      hip_size_inches,
      inseam
    ]
    const { productSizes, category } = this.props.navigation.state.params
    const categoryUrl =
      category.name === 'dresses'
        ? require('../../../assets/images/productSizes/dresses.png')
        : category.name === 'jackets'
        ? require('../../../assets/images/productSizes/jackets.png')
        : category.name === 'pants'
        ? require('../../../assets/images/productSizes/pants.png')
        : category.name === 'skirts'
        ? require('../../../assets/images/productSizes/skirts.png')
        : category.name === 'tops' || category.name === 'sweaters'
        ? require('../../../assets/images/productSizes/tops.png')
        : category.name === 'shorts'
        ? require('../../../assets/images/productSizes/shorts.png')
        : category.name === 'suits'
        ? require('../../../assets/images/productSizes/suits.png')
        : null
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title="尺码表"
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.myStyles}>
            <View style={styles.header}>
              <Text style={styles.title}>{'我的尺码'}</Text>
              <TouchableOpacity
                onPress={this._editSize}
                style={styles.touchableEdit}>
                <Text style={styles.edit}>{'编辑'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.keyView}>
              {this.signArr.map(item => {
                return (
                  <View style={styles.keyItems} key={item.title}>
                    <Text style={styles.keyTitle}>{item.title}</Text>
                    <Text style={styles.keyUnit}>{item.unit}</Text>
                  </View>
                )
              })}
            </View>
            <View style={styles.valueView}>
              {myStyles.map((item, index) => {
                return (
                  <Text key={index} style={styles.value}>
                    {item ? item : '-'}
                  </Text>
                )
              })}
            </View>
          </View>
          <View style={styles.myStyles}>
            <View style={styles.header}>
              <Text style={styles.title}>{'商品尺码'}</Text>
            </View>
            <View style={styles.keyView}>
              {this.sizesKeysArr.map(item => {
                return (
                  <View style={styles.keyItems} key={item.title}>
                    <Text style={styles.keyTitle}>{item.title}</Text>
                    <Text style={styles.keyUnit}>{item.unit}</Text>
                  </View>
                )
              })}
            </View>
            {productSizes.map((item, index) => {
              const isRealtimeRecommendedSize =
                !!this.state.realtimeRecommendedSize &&
                item.size.name === this.state.realtimeRecommendedSize.name
              return (
                <View
                  style={
                    isRealtimeRecommendedSize
                      ? styles.highlightValueView
                      : styles.valueView
                  }
                  key={index}>
                  {isRealtimeRecommendedSize && (
                    <Text style={styles.recommended}>推荐</Text>
                  )}
                  {!!item.size_abbreviation && (
                    <Text
                      style={[
                        styles.value,
                        isRealtimeRecommendedSize && styles.recommendedNear
                      ]}>
                      {l10nForSizeUI(item.size_abbreviation)}
                    </Text>
                  )}
                  {!!item.shoulder && (
                    <Text style={styles.value}>{item.shoulder}</Text>
                  )}
                  {!!item.bust && (
                    <SizeRangeView
                      minValue={parseInt(item.bust_min_tolerance)}
                      maxValue={parseInt(item.bust_max_tolerance)}
                      itemStyleValue={parseInt(bust)}
                      checkInTolerance={this._checkInTolerance}
                    />
                  )}
                  {!!item.waist && (
                    <SizeRangeView
                      minValue={parseInt(item.waist_min_tolerance)}
                      maxValue={parseInt(item.waist_max_tolerance)}
                      itemStyleValue={parseInt(style.waist_size)}
                      checkInTolerance={this._checkInTolerance}
                    />
                  )}
                  {!!item.hip && (
                    <SizeRangeView
                      minValue={parseInt(item.hips_min_tolerance)}
                      maxValue={parseInt(item.hips_max_tolerance)}
                      itemStyleValue={parseInt(style.hip_size_inches)}
                      checkInTolerance={this._checkInTolerance}
                    />
                  )}
                  {!!item.inseam && (
                    <Text style={styles.value}>{item.inseam}</Text>
                  )}
                  {!!item.front_length && (
                    <Text style={styles.value}>{item.front_length}</Text>
                  )}
                  {!!item.back_length && (
                    <Text style={styles.value}>{item.back_length}</Text>
                  )}
                </View>
              )
            })}
            {!!this.sizeType && !this.state.inTolerance && (
              <Text style={styles.tipsText}>
                {'*Tips: 商品是'}
                {this.sizeType}
                {'，可能比中国尺码略微偏大'}
              </Text>
            )}
            {this.state.inTolerance && (
              <View style={styles.tipsView}>
                <Text
                  style={[styles.startFont, styles.tipsTextDescriptionMargin]}>
                  {'*'}
                </Text>
                <Text style={styles.tipsTextDescription}>{'Tips:'}</Text>
                <Text style={styles.circleFontTip}>{'•'}</Text>
                <Text
                  style={[
                    styles.tipsTextDescription,
                    styles.tipsTextDescriptionMargin
                  ]}>
                  {'表示你的个人尺码在数据范围内'}
                </Text>
              </View>
            )}

            {!!categoryUrl && (
              <View style={styles.myStyles}>
                <View style={styles.header}>
                  <Text style={styles.title}>{'尺码图示'}</Text>
                </View>
                <View style={styles.clothingView}>
                  <Image
                    source={categoryUrl}
                    style={styles.clothingImage}
                    resizeMode="cover"
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export class SizeRangeView extends PureComponent {
  componentDidMount() {
    const { checkInTolerance } = this.props
    this.inTolerance && checkInTolerance(this.inTolerance)
  }
  render() {
    const { minValue, maxValue, itemStyleValue } = this.props
    this.inTolerance = minValue <= itemStyleValue && itemStyleValue <= maxValue
    return (
      <View style={styles.keyItems}>
        <Text style={[styles.toleranceTitle, this.inTolerance && styles.fixUI]}>
          {minValue + '-' + maxValue}
        </Text>
        {this.inTolerance && <Text style={styles.circleFont}>{'•'}</Text>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  myStyles: {
    marginTop: 4,
    marginBottom: 4
  },
  header: {
    height: 52,
    paddingHorizontal: 15,
    justifyContent: 'center'
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    color: '#242424',
    lineHeight: 22
  },
  touchableEdit: {
    position: 'absolute',
    right: 15
  },
  edit: {
    fontWeight: '500',
    fontSize: 14,
    color: '#EA5C39',
    lineHeight: 16
  },
  keyView: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
    backgroundColor: '#eee'
  },
  keyItems: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  keyTitle: {
    fontWeight: '400',
    fontSize: 11,
    color: '#333',
    lineHeight: 11,
    paddingTop: 4,
    paddingBottom: 3
  },
  keyUnit: {
    fontWeight: '400',
    fontSize: 10,
    color: '#999',
    lineHeight: 10
  },
  valueView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#f9f9f9'
  },
  highlightValueView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#FFEED7',
    borderBottomColor: '#F3BF78',
    borderTopColor: '#F3BF78',
    borderBottomWidth: 1,
    borderTopWidth: 1
  },
  value: {
    flex: 1,
    fontWeight: '400',
    fontSize: 11,
    color: '#333',
    lineHeight: 15,
    textAlign: 'center'
  },
  recommended: {
    position: 'absolute',
    left: 0,
    height: 40,
    width: 17,
    fontSize: 11,
    backgroundColor: '#F3BF78',
    color: 'white',
    textAlign: 'center',
    paddingTop: 8
  },
  tipsText: {
    paddingLeft: 15,
    fontSize: 12,
    color: '#000000',
    lineHeight: 48
  },
  clothingView: {
    marginTop: 10,
    alignItems: 'center',
    height: p2d(240),
    marginBottom: 50
  },
  clothingImage: {
    width: p2d(325),
    height: p2d(210)
  },
  toleranceTitle: {
    fontWeight: '400',
    fontSize: 11,
    color: '#333'
  },
  fixUI: {
    marginTop: 14
  },
  circleFont: {
    fontWeight: '400',
    color: '#F7B1A6',
    fontSize: 16,
    lineHeight: 12
  },
  circleFontTip: {
    marginLeft: 10,
    marginRight: 3,
    color: '#F7B1A6'
  },
  tipsView: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15
  },
  tipsTextDescription: {
    fontSize: 12,
    color: '#989898'
  },
  tipsTextDescriptionMargin: {
    marginTop: 3
  },
  startFont: {
    color: '#E85C40'
  },
  recommendedNear: {
    marginLeft: 3
  }
})
