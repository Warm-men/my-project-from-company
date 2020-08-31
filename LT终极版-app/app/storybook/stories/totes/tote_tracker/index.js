/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import CallToActionButton from './tote_tracker_call_to_action'
import Products from './tote_tracker_products'
import StatusBar from './tote_tracker_status_bar'
import PayProducts from './tote_tracker_pay_products'
class ToteTracker extends Component {
  render() {
    const {
      tote,
      showToteList,
      lockLatestTote,
      showExpressInformation,
      markToteDelivered,
      returnTote,
      didSelectedItem,
      rateTote,
      trackingCode,
      activities,
      activitiesOnGoing,
      didSelectedActivityItem,
      isContarcted,
      isFinishRating,
      ratingIncentive,
      hasClothesCoupon,
      removeCouponToTote,
      useCoupon,
      state,
      isFirstTote
    } = this.props
    const isOperableTote = tote.state === 'viewed' || tote.state === 'styled'
    const shippingStatus = tote.shipping_status
    const isDownOrder = tote.state === 'locked' ? true : false
    const isTransit =
      tote.outbound_shipping_code !== null &&
      tote.state === 'shipped' &&
      !shippingStatus.steps.delivered.complete
    const isDelivered =
      shippingStatus.steps.delivered.complete &&
      tote.scheduled_pickups.length === 0

    //活动 夏日活动
    const hasSummerPlanActivity =
      activities.summerPlan &&
      activities.summerPlan.active === false &&
      isOperableTote
    const hasClothesCouponActivity = hasClothesCoupon && isOperableTote
    const toteClothingProduct = tote.tote_products.filter(function(item) {
      return item.product.type === 'Clothing'
    })
    const toteAccessoryProduct = tote.tote_products.filter(function(item) {
      return item.product.type === 'Accessory'
    })
    let subtitle = `<${toteClothingProduct.length}件衣服+${
      toteAccessoryProduct.length
    }件配饰>`
    return (
      <View style={styles.container}>
        <Text style={styles.statesTitle}>{shippingStatus.title}</Text>
        {toteClothingProduct.length > 5 && (
          <Text style={styles.subtitle}> {subtitle} </Text>
        )}
        {isOperableTote && activitiesOnGoing}
        {isDelivered ? (
          <PayProducts
            products={tote.tote_products}
            didSelectedItem={didSelectedItem}
            state={tote.state}
            toteId={tote.id}
          />
        ) : (
          <Products
            hasClothesCoupon={hasClothesCouponActivity}
            hasSummerPlanActivity={hasSummerPlanActivity}
            didSelectedActivityItem={didSelectedActivityItem}
            products={tote.tote_products}
            didSelectedItem={didSelectedItem}
            removeCouponToTote={removeCouponToTote}
            useCoupon={useCoupon}
            inTote={true}
            state={state}
          />
        )}
        {!isDelivered && <StatusBar toteShippingStatus={shippingStatus} />}
        <CallToActionButton
          isContarcted={isContarcted}
          isDownOrder={isDownOrder}
          toteState={tote.state}
          showToteList={showToteList}
          lockLatestTote={lockLatestTote}
          showExpressInformation={showExpressInformation}
          markToteDelivered={markToteDelivered}
          returnTote={returnTote}
          rateTote={rateTote}
          isTransit={isTransit}
          isDelivered={isDelivered}
          isFinishRating={isFinishRating}
          trackingCode={trackingCode}
          ratingIncentive={ratingIncentive}
          isFirstTote={isFirstTote}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    elevation: 1,
    alignItems: 'center'
  },
  statesTitle: {
    marginTop: 10,
    marginBottom: 12,
    fontWeight: '500',
    fontSize: 18,
    color: '#333',
    letterSpacing: -0.52
  },
  subtitle: {
    fontSize: 12,
    color: '#989898'
  }
})

export default ToteTracker
