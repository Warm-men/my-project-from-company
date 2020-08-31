import React, { PureComponent } from 'react'
import { View, StyleSheet, FlatList, ScrollView } from 'react-native'
import { NavigationBar, BarButtonItem, SafeAreaView } from '../../navigationbar'
import p2d from '../../../../src/expand/tool/p2d'
import CouponAutoDeduct from './coupon'
import AvailablePurchaseCredit from './available_purchase_credit'
import PopUpPanel from '../../../../src/components/pop_up_panel'
import PayType from './pay_type_view'
import SubscriptionItem from './single_subscription_item'
import ExtendSubscriptionItem from './single_extend_subscription_item'
import { SinglePlansBanner, PaymentBottom, PlansAgreement } from '../../plans'
import Image from '../../image'
export default class SingleJoinMember extends PureComponent {
  constructor(props) {
    super(props)
    const { enablePaymentContract, isSubscriber, nowPlan } = props
    this.state = {
      isSelectedFreeService:
        !enablePaymentContract.length &&
        isSubscriber &&
        nowPlan &&
        !!nowPlan.auto_renew_discount_amount
          ? true
          : false
    }
  }
  componentDidMount() {
    const { appStore } = this.props
    appStore.barStyleColor = 'default'
  }

  returnSubscriptionGroupsItem = obj => {
    if (obj) {
      return (
        <Image
          style={{ width: p2d(276), height: p2d(176) }}
          source={{ uri: obj.image }}
        />
      )
    }
  }

  didSelectedFreeService = refresh => {
    const { didSelectedFreeService } = this.props
    let isSelectedFreeService
    if (refresh === true) {
      isSelectedFreeService = false
    } else {
      isSelectedFreeService = !this.state.isSelectedFreeService
    }
    this.setState(
      {
        isSelectedFreeService
      },
      () => {
        didSelectedFreeService && didSelectedFreeService(isSelectedFreeService)
      }
    )
  }

  didSelectedPlan = nowPlan => {
    const { didSelectedPlan } = this.props
    didSelectedPlan && didSelectedPlan(nowPlan)
    if (nowPlan.interval === 1) {
      this.setState({ isSelectedFreeService: true })
    }
  }

  _renderItemTest = ({ item, index }) => {
    let isSelected = false
    const {
      nowPlan,
      didSelectedPlan,
      navigation,
      isSubscriber,
      enablePaymentContract,
      isValidSubscriber
    } = this.props
    if (nowPlan && nowPlan.id && item.id === nowPlan.id) {
      isSelected = true
    }
    if (isSubscriber && isValidSubscriber) {
      return (
        <ExtendSubscriptionItem
          isSelected={isSelected}
          item={item}
          didSelectedItem={this.didSelectedPlan}
          didSelectedFreeService={this.didSelectedFreeService}
          isSelectedFreeService={this.state.isSelectedFreeService}
          index={index}
          enablePaymentContract={enablePaymentContract}
        />
      )
    } else {
      return (
        <SubscriptionItem
          isSelected={isSelected}
          item={item}
          didSelectedItem={didSelectedPlan}
          navigation={navigation}
        />
      )
    }
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
      nowGroup,
      goBack,
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
      price,
      cashPrice
    } = this.props
    const showPromoCodes = !!(allPromoCodes && allPromoCodes.length && nowPlan)
    const showPurchaseCredit = allAvailablePurchaseCredit > 0 && nowPlan
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          hasBottomLine={false}
          title={'会员支付'}
          leftBarButtonItem={
            <BarButtonItem onPress={goBack} buttonType={'back'} />
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.mainView}>
          <View style={styles.emptyView} />
          <SinglePlansBanner currentPlan={nowPlan} />
          <FlatList
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            keyExtractor={this._extractUniqueKey}
            data={nowGroup}
            extraData={{ ...nowPlan } || this.state.isSelectedFreeService}
            renderItem={this._renderItemTest}
          />
          {(showPromoCodes || showPurchaseCredit) && (
            <View style={styles.preview}>
              {showPromoCodes && (
                <CouponAutoDeduct
                  selectCoupon={selectPromoCode}
                  tempCoupon={nowCoupon}
                  style={[
                    styles.previewView,
                    showPurchaseCredit && styles.line
                  ]}
                />
              )}
              {showPurchaseCredit && (
                <AvailablePurchaseCredit
                  allAvailablePurchaseCredit={allAvailablePurchaseCredit}
                  availablePurchaseCredit={cashPrice}
                  style={styles.previewView}
                />
              )}
            </View>
          )}
          <PlansAgreement navigation={navigation} />
        </ScrollView>
        <PaymentBottom
          nowPlan={nowPlan}
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
    flex: 1
  },
  mainView: {
    backgroundColor: '#F7F7F7'
  },
  openFreeService: {
    marginHorizontal: p2d(15),
    paddingRight: p2d(15),
    paddingLeft: p2d(5),
    marginBottom: 12,
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: '#d9d9d9',
    height: 48
  },
  preview: {
    borderWidth: 0.5,
    borderRadius: 4,
    overflow: 'hidden',
    borderColor: '#d9d9d9',
    marginHorizontal: p2d(15)
  },
  previewView: {
    paddingRight: p2d(15),
    paddingLeft: p2d(5)
  },
  emptyView: { height: 15 },
  line: { borderBottomWidth: 0.5, borderColor: '#d9d9d9' }
})
