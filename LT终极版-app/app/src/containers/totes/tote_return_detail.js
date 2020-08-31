import React, { Component } from 'react'
import { StyleSheet, Clipboard } from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { inject } from 'mobx-react'
import ToteReturnDetailAutoPickup from '../../../storybook/stories/totes/tote_return/tote_return_detail_auto_pickup'
import ToteReturnDetailSelfDelivery from '../../../storybook/stories/totes/tote_return/tote_return_detail_self_delivery'
import ToteReturnDetailActions from '../../../storybook/stories/totes/tote_return/tote_return_detail_actions'
@inject('appStore')
export default class ToteReturnDetail extends Component {
  constructor(props) {
    super(props)
    const { tote, scheduledReturnType } = props.navigation.state.params
    const {
      scheduled_return: { scheduled_auto_pickup }
    } =
      scheduledReturnType === 'tote_scheduled_return'
        ? tote
        : tote.tote_free_service
    this.state = {
      isScheduledAutoPickup: !!scheduled_auto_pickup ? true : false
    }
    this.isScheduledAutoPickup = !!scheduled_auto_pickup
  }
  _goBack = () => this.props.navigation.goBack()

  _gotoScheduleAutoPickup = () => {
    const { navigation } = this.props
    const { tote, scheduledReturnType } = navigation.state.params
    navigation.navigate('ToteReturnModifySchedule', {
      tote,
      scheduledReturnType
    })
  }

  _gotoScheduleSeflDelivery = () => {
    this.setState({
      isScheduledAutoPickup: false
    })
  }

  _gotoSeflDeliveryGuide = () => {
    const { navigation } = this.props
    navigation.navigate('HiveBox', { isPadding: true })
  }

  _modifyShippingCode = () => {
    const { navigation } = this.props
    const { tote, scheduledReturnType } = navigation.state.params
    navigation.navigate('TrackingNumberInput', {
      tote,
      scheduledReturnType,
      isScheduledAutoPickup: this.isScheduledAutoPickup
    })
  }

  _copyContent = async () => {
    const { fc_address } = this.props.navigation.state.params.tote
    const { appStore } = this.props
    Clipboard.setString(fc_address)
    try {
      let result = await Clipboard.getString()
      if (result) {
        appStore.showToast('复制成功', 'success')
      }
    } catch (e) {
      appStore.showToast('复制失败', 'error')
    }
  }

  render() {
    const { navigation } = this.props
    const { isScheduledAutoPickup } = this.state
    const { tote, scheduledReturnType } = navigation.state.params
    const title = isScheduledAutoPickup ? '预约详情' : '自行寄回'
    const isToteScheduledReturn =
      scheduledReturnType === 'tote_scheduled_return'
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          style={styles.navigationBar}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
          hasBottomLine={true}
          title={title}
        />
        {isScheduledAutoPickup ? (
          <ToteReturnDetailAutoPickup
            isToteScheduledReturn={isToteScheduledReturn}
            tote={tote}
            navigation={navigation}
          />
        ) : (
          <ToteReturnDetailSelfDelivery
            gotoSeflDeliveryGuide={this._gotoSeflDeliveryGuide}
            tote={tote}
            isToteScheduledReturn={isToteScheduledReturn}
            copyContent={this._copyContent}
          />
        )}
        <ToteReturnDetailActions
          gotoScheduleAutoPickup={this._gotoScheduleAutoPickup}
          gotoScheduleSeflDelivery={this._gotoScheduleSeflDelivery}
          modifyShippingCode={this._modifyShippingCode}
          tote={tote}
          isToteScheduledReturn={isToteScheduledReturn}
          isScheduledAutoPickup={isScheduledAutoPickup}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
