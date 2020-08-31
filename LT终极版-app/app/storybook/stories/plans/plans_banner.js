/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import Image from '../image.js'

export default class PlansBanner extends PureComponent {
  returnPlanImageHeight = () => {
    const { currentPlan } = this.props
    let height = 0
    if (!currentPlan) return height
    if (currentPlan.operation_plan) {
      const {
        image_url,
        image_height,
        image_width
      } = currentPlan.operation_plan
      if (image_url && image_height && image_width) {
        height = (image_height / image_width) * p2d(345)
      } else {
        height = 0
      }
    }
    return height
  }

  render() {
    const { currentPlan } = this.props
    if (!currentPlan || !currentPlan.operation_plan) {
      return <View />
    }
    const planImageHeight = this.returnPlanImageHeight()
    return (
      <View style={[styles.cardView, { height: planImageHeight }]}>
        <Image
          style={{ height: planImageHeight, width: p2d(335) }}
          resizeMode="cover"
          source={{
            uri: currentPlan.operation_plan.image_url
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cardView: {
    flex: 1,
    paddingHorizontal: p2d(20),
    marginBottom: p2d(12)
  },
  titleView: {
    position: 'absolute',
    top: p2d(30),
    left: p2d(35),
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconStyle: {
    height: 16,
    width: 27,
    marginLeft: 4
  },
  cardName: {
    fontSize: 21,
    color: '#ebdec2',
    fontWeight: '700'
  }
})
