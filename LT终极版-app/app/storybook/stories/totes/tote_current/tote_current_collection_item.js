/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import ToteStatusBar from './tote_status_bar'
import ToteCurrentProductsList from './tote_current_products_list'
import ToteTip from './tote_tip'
import ToteReturnScheduleCard from './tote_current_schedule_card'
import FreeServiceOvertime from './free_service_overtime'
import ToteCurrentSiblingComponent from './tote_current_sibling_component'
import ToteFreeServiceTip from './tote_free_service_tip'
import RemindScheduleFreeServiceItsefl from './remind_schedule_free_service_itself'
import matchFreeServiceType from '../../../../src/expand/tool/tote/match_free_service_type'
export default class ToteCurrentCollectionItem extends PureComponent {
  _onlyReturnToteFreeService = () => {
    const { tote, onlyReturnToteFreeService } = this.props
    onlyReturnToteFreeService(tote)
  }
  _pushToMyCustomerPhotos = () => {
    const { pushToMyCustomerPhotos, tote } = this.props
    pushToMyCustomerPhotos && pushToMyCustomerPhotos(tote.id)
  }
  _checkTFSState = () => {
    const { tote_free_service } = this.props.tote
    if (!tote_free_service || !tote_free_service.hint.tote_page_return_remind)
      return { isShow: false }
    const { type, message } = tote_free_service.hint.tote_page_return_remind
    switch (type) {
      case 'scheduled_with_prev_tote': //已随上个衣箱归还，且顺丰未取件
      case 'undelivered': //未签收
        return { isShow: true, message }
      default:
        return { isShow: false }
    }
  }
  _getScheduledReturn = type => {
    const { tote } = this.props
    let scheduledReturn = null
    if (type === 'tote_free_service_scheduled_return') {
      scheduledReturn =
        tote.tote_free_service && tote.tote_free_service.scheduled_return
    } else {
      scheduledReturn = tote.scheduled_return
    }
    const { scheduled_auto_pickup, scheduled_self_delivery } =
      scheduledReturn || {}
    return scheduled_auto_pickup || scheduled_self_delivery
  }

  _isFinishedToteFreeService = () => {
    const { tote_free_service } = this.props.tote
    if (!tote_free_service) return true
    if (
      tote_free_service.state === 'complete' ||
      tote_free_service.state === 'deducted'
    ) {
      return true
    } else {
      return false
    }
  }

  render() {
    const {
      tote,
      didSelectedItem,
      toteBuyProduct,
      rateTote,
      rateService,
      returnTote,
      returnPreTote,
      showExpressInformation,
      markToteDelivered,
      gotoReturnToteDetail,
      fillInTrackingNumber,
      linkToToteFreeServiceHelp
    } = this.props
    const { pull_tote_tip } = tote
    const TFSState = this._checkTFSState()
    const TFSScheduleItsefl = matchFreeServiceType('return_free_service', tote)
    const ugentlyReturnFreeService = matchFreeServiceType(
      'ugently_return_free_service',
      tote
    )
    const toteScheduleReturnCard = this._getScheduledReturn(
      'tote_scheduled_return'
    )
    const toteFreeServiceScheduledReturn = this._getScheduledReturn(
      'tote_free_service_scheduled_return'
    )
    const isFinishedToteFreeService = this._isFinishedToteFreeService()
    return (
      <View>
        <ToteCurrentSiblingComponent>
          {TFSState.isShow && <ToteFreeServiceTip message={TFSState.message} />}
          {TFSScheduleItsefl && (
            <RemindScheduleFreeServiceItsefl
              tote={tote}
              linkToToteFreeServiceHelp={linkToToteFreeServiceHelp}
              onlyReturnToteFreeService={this._onlyReturnToteFreeService}
            />
          )}
          {ugentlyReturnFreeService && <FreeServiceOvertime />}
          {!!toteFreeServiceScheduledReturn && !isFinishedToteFreeService && (
            <ToteReturnScheduleCard
              gotoReturnToteDetail={gotoReturnToteDetail}
              tote={tote}
              scheduledReturnType={'tote_free_service_scheduled_return'}
              fillInTrackingNumber={fillInTrackingNumber}
            />
          )}
          {!!toteScheduleReturnCard && (
            <ToteReturnScheduleCard
              gotoReturnToteDetail={gotoReturnToteDetail}
              tote={tote}
              scheduledReturnType={'tote_scheduled_return'}
              fillInTrackingNumber={fillInTrackingNumber}
            />
          )}
        </ToteCurrentSiblingComponent>
        <View style={styles.container}>
          <ToteStatusBar
            pushToMyCustomerPhotos={this._pushToMyCustomerPhotos}
            rateTote={rateTote}
            rateService={rateService}
            tote={tote}
            returnTote={returnTote}
            markToteDelivered={markToteDelivered}
            showExpressInformation={showExpressInformation}
            returnPreTote={returnPreTote}
            onlyReturnToteFreeService={this._onlyReturnToteFreeService}
          />
          {!!pull_tote_tip && <ToteTip message={pull_tote_tip} />}
          <ToteCurrentProductsList
            products={tote.tote_products}
            didSelectedItem={didSelectedItem}
            toteBuyProduct={toteBuyProduct}
            toteId={tote.id}
            orders={tote.orders}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: '#FFF',
    paddingVertical: p2d(22),
    marginHorizontal: p2d(16),
    marginTop: p2d(16),
    elevation: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4
  },
  viewTitle: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    paddingTop: 16,
    backgroundColor: '#fff'
  }
})
