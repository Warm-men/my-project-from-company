/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SizeSelector } from '../../size'
import FitMessage from '../../products/details/fit_message'

export default class BodyView extends PureComponent {
  _didSelectedItem = item => {
    const { didSelectedItem } = this.props
    didSelectedItem && didSelectedItem(item)
  }
  render() {
    const {
      selectedSize,
      recommendedSize,
      data,
      inToteProduct,
      fitMessages,
      isAccessory,
      lockMessage,
      hasStylesForRecommend
    } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          <Text style={styles.title}>确认尺码</Text>
        </View>
        <SizeSelector
          selectedSize={selectedSize}
          recommendedSize={recommendedSize}
          data={data}
          inToteProduct={inToteProduct}
          didSelectedItem={this._didSelectedItem}
        />
        {!isAccessory && hasStylesForRecommend ? (
          <FitMessage
            recommendedSize={recommendedSize}
            fitMessages={fitMessages}
            selectedSize={selectedSize}
            lockMessage={lockMessage}
          />
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 15 },
  topView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: 10
  },
  title: { fontSize: 14, color: '#242424', fontWeight: '500' }
})
