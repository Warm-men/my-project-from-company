/* @flow */

import React, { Component, PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import ProductIncompleteStyleView from './product_incomplete_style'
import { SizeSelector } from '../../size'
import FitMessage from './fit_message'

export default class ProductDetailSize extends Component {
  constructor(props) {
    super(props)

    let selectedSize = null

    if (props.inToteProduct) {
      const index = props.productSizes.findIndex(function(productSize) {
        return (
          productSize.size.name === props.inToteProduct.product_size.size.name
        )
      })
      if (index !== -1) {
        selectedSize = props.productSizes[index]
      }
    }
    this.state = { selectedSize }
  }

  _didSelectedItem = selectedSize => {
    const { onSelect } = this.props
    if (!(this.state.selectedSize === selectedSize)) {
      this.setState({ selectedSize }, () => {
        onSelect && onSelect(selectedSize)
      })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const currentSize =
      nextProps.currentSize && nextProps.currentSize.size_abbreviation
    const selectedSize =
      this.state.selectedSize && this.state.selectedSize.size_abbreviation

    if (!!currentSize && selectedSize !== currentSize) {
      this.setState({ selectedSize: nextProps.currentSize })
    }
  }

  render() {
    const {
      productSizes,
      pushToSizeChart,
      isSubscriber,
      hasStylesForRecommend,
      hasCompleteSizes,
      pushToStyle,
      style,
      shouldShowReasons,
      realtimeRecommendedSize,
      inToteProduct,
      realtimeFitMessages,
      lockMessage
    } = this.props
    return (
      <View style={[styles.container, style]}>
        <View style={styles.sizeContent}>
          <SizeSelector
            style={styles.sizeSelector}
            selectedSize={this.state.selectedSize}
            recommendedSize={realtimeRecommendedSize}
            data={productSizes}
            inToteProduct={inToteProduct}
            didSelectedItem={this._didSelectedItem}
          />
          {shouldShowReasons && (
            <TouchableOpacity style={styles.rule} onPress={pushToSizeChart}>
              <Text style={styles.sizeInfo}>尺码表</Text>
              <Icon size={12} name="ios-arrow-forward" color={'#5e5e5e'} />
            </TouchableOpacity>
          )}
        </View>
        {shouldShowReasons ? (
          <MessageComponent
            lockMessage={lockMessage}
            selectedSize={this.state.selectedSize}
            recommendedSize={realtimeRecommendedSize}
            fitMessages={realtimeFitMessages}
            isSubscriber={isSubscriber}
            hasStylesForRecommend={hasStylesForRecommend}
            hasCompleteSizes={hasCompleteSizes}
            pushToStyle={pushToStyle}
          />
        ) : null}
      </View>
    )
  }
}

class MessageComponent extends PureComponent {
  render() {
    const {
      hasStylesForRecommend,
      hasCompleteSizes,
      pushToStyle,
      selectedSize,
      recommendedSize,
      fitMessages,
      lockMessage
    } = this.props

    return (
      <View>
        {hasStylesForRecommend && (
          <FitMessage
            selectedSize={selectedSize}
            recommendedSize={recommendedSize}
            fitMessages={fitMessages}
            lockMessage={lockMessage}
          />
        )}
        {!hasCompleteSizes && (
          <ProductIncompleteStyleView pushToStyle={pushToStyle} />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    paddingTop: 20
  },
  sizeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  sizeSelector: { flex: 1 },
  sizeInfo: { fontSize: 13, color: '#5e5e5e', marginRight: 4 },
  rule: { flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }
})
