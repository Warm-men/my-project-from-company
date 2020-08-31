import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native'
import Icons from 'react-native-vector-icons/SimpleLineIcons'
import { NavigationBar, BarButtonItem, SafeAreaView } from '../../navigationbar'
import p2d from '../../../../src/expand/tool/p2d'
import CouponAutoDeduct from './coupon'
import AvailablePurchaseCredit from './available_purchase_credit'
import PopUpPanel from '../../../../src/components/pop_up_panel'
import PayType from './pay_type_view'
import SubscriptionItem from './subscription_item'
import { PlansBanner, PaymentBottom, PlansAgreement } from '../../plans'
import Image from '../../image'
import EZSwiper from '../../ez_swiper'
import FreeServiceBanner from './free_password_banner'
const { width } = Dimensions.get('window')

export default class MultipleJoinMember extends Component {
  componentDidMount() {
    if (Platform.OS === 'ios') {
      this.props.appStore.barStyleColor = 'light-content'
    }
  }
  componentWillUnmount() {
    this.props.appStore.barStyleColor = 'default'
  }
  returnSubscriptionGroupsItem = obj => {
    if (obj) {
      return (
        <Image
          style={{ width: p2d(276), height: p2d(192) }}
          source={{ uri: obj.image }}
        />
      )
    }
  }

  _renderItem = ({ item }) => {
    let isSelected = false
    const { nowPlan, didSelectedPlan } = this.props
    if (nowPlan && nowPlan.id && item.id === nowPlan.id) {
      isSelected = true
    }
    return (
      <SubscriptionItem
        isSelected={isSelected}
        item={item}
        didSelectedItem={didSelectedPlan}
      />
    )
  }

  _extractUniqueKey(item, index) {
    return index.toString()
  }

  _popPanelHide = () => {
    this._popUpPanel._onHide()
  }

  render() {
    const {
      nowPlan,
      allAvailablePurchaseCredit,
      nowCoupon,
      allPromoCodes,
      groupsIndex,
      nowGroup,
      goBack,
      changeSubscriptionGroupsItem,
      navigation,
      subscriptionTime,
      selectPayType,
      pupVisible,
      payType,
      changeType,
      pay,
      selectPromoCode,
      popUpPanelOnClose,
      isSubscriber,
      subscriptionGroups,
      price,
      cashPrice,
      autoRenewDiscount,
      autoRenewDiscountHint
    } = this.props

    const titleColor = { color: '#fff' }

    const showPromoCodes = !!(allPromoCodes && allPromoCodes.length && nowPlan)
    const showPurchaseCredit = allAvailablePurchaseCredit > 0 && nowPlan
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          style={styles.navigationBar}
          title={'会员支付'}
          titleColor={titleColor}
          leftBarButtonItem={
            <BarButtonItem onPress={goBack}>
              <Icons name={'arrow-left'} size={16} {...titleColor} />
            </BarButtonItem>
          }
        />
        <ScrollView
          bounces={false}
          style={styles.mainView}
          showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: '#fff' }}>
            {/* 底色半弧 */}
            <View style={{ backgroundColor: '#fff' }}>
              <Image
                style={styles.combinedShape}
                source={require('../../../../assets/images/account/combined_shape.png')}
              />
              <EZSwiper
                style={styles.ezSwiper}
                dataSource={subscriptionGroups}
                width={width}
                height={p2d(192)}
                loop={false}
                cardParams={{
                  cardSide: width * 0.74,
                  cardSmallSide: p2d(192) * 0.74,
                  cardSpace: ((width * (1 - 0.74)) / 2) * 0.2
                }} //缩放高级计算方式cardSide是放大后的宽度,cardSmallSide是大小的间距,cardSpace是小的卡片的高度
                renderRow={this.returnSubscriptionGroupsItem}
                scrollEnd={changeSubscriptionGroupsItem}
                index={groupsIndex}
              />
            </View>
            <PlansBanner currentPlan={nowPlan} />
            <FlatList
              scrollEnabled={false}
              style={styles.flatlist}
              showsVerticalScrollIndicator={false}
              keyExtractor={this._extractUniqueKey}
              data={nowGroup}
              extraData={nowPlan}
              renderItem={this._renderItem}
            />
            <FreeServiceBanner
              style={[
                styles.previewView,
                { borderBottomWidth: 12, borderColor: '#f7f7f7', height: 60 }
              ]}
              autoRenewDiscountHint={autoRenewDiscountHint}
              navigation={navigation}
            />
            <FreeServiceBanner
              autoRenewDiscount={autoRenewDiscount}
              style={[
                styles.previewView,
                (showPurchaseCredit || showPromoCodes) && styles.line
              ]}
            />
            {showPromoCodes && (
              <CouponAutoDeduct
                style={[styles.previewView, showPurchaseCredit && styles.line]}
                selectCoupon={selectPromoCode}
                tempCoupon={nowCoupon}
              />
            )}
            {showPurchaseCredit && (
              <AvailablePurchaseCredit
                style={styles.previewView}
                allAvailablePurchaseCredit={allAvailablePurchaseCredit}
                availablePurchaseCredit={cashPrice}
              />
            )}
          </View>
          <PlansAgreement navigation={navigation} />
        </ScrollView>
        <PaymentBottom
          subscriptionTime={subscriptionTime}
          selectPayType={selectPayType}
          isSubscriber={isSubscriber}
          price={price}
        />
        <PopUpPanel
          ref={popUpPanel => (this._popUpPanel = popUpPanel)}
          onClose={popUpPanelOnClose}
          visible={pupVisible}>
          <PayType
            type={payType}
            changeType={changeType}
            price={price}
            pay={pay}
            onHide={this._popPanelHide}
          />
        </PopUpPanel>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'rgba(41, 41, 40, 1)'
  },
  navigationBar: {
    borderBottomWidth: 0,
    backgroundColor: 'rgba(41, 41, 40, 0)'
  },
  mainView: {
    backgroundColor: '#f7f7f7'
  },
  previewView: {
    paddingHorizontal: p2d(20)
  },
  line: { borderBottomWidth: 1, borderColor: '#f2f2f2' },
  ezSwiper: {
    width: width,
    height: p2d(180),
    marginTop: p2d(20),
    marginBottom: p2d(30)
  },
  combinedShape: {
    position: 'absolute',
    top: -64,
    width: p2d(375),
    height: p2d(226)
  },
  flatlist: {
    paddingHorizontal: p2d(20),
    borderBottomWidth: 12,
    borderBottomColor: '#f7f7f7'
  }
})
