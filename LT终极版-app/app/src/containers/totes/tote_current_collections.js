/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, DeviceEventEmitter } from 'react-native'
import {
  QNetwork,
  SERVICE_TYPES,
  Mutate
} from '../../expand/services/services.js'
import { ToteEmpty } from '../../../storybook/stories/totes'
import ToteCurrentCollectionItem from '../../../storybook/stories/totes/tote_current/tote_current_collection_item'
import { Column } from '../../expand/tool/add_to_closet_status'
import Statistics from '../../expand/tool/statistics'
import { inject, observer } from 'mobx-react'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
import { toteReturnHint } from '../../expand/tool/tote/tote_return_hint'
import { format } from 'date-fns'
@inject('modalStore', 'currentCustomerStore', 'totesStore', 'guideStore')
@observer
export default class ToteCurrentCollectionsContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { currentTotesData: null }
    this.variables = { filter: 'current' }
    this.isLoading = false
  }

  componentDidMount() {
    const { finishedRefreshing } = this.props
    this._getCurrentTotes(finishedRefreshing)
  }

  _getCurrentTotes = callback => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const variables = this.variables
    QNetwork(
      SERVICE_TYPES.totes.QUERY_TOTES,
      variables,
      response => {
        this.isLoading = false

        const { totes } = response.data
        const hasOperableTote = totes && totes.length !== 0
        callback && callback(hasOperableTote)

        const { totesStore } = this.props
        totesStore.updateCurrentTotes(totes)

        this.setState({ currentTotesData: totes })
      },
      () => {
        this.isLoading = false
        callback && callback()
        this.setState({ currentTotesData: null })
      }
    )
  }

  _didSelectedItem = product => {
    const { navigation } = this.props
    const column = Column.CurrentTote
    navigation.navigate('Details', { item: product, column })
  }

  _toteBuyProduct = (product, toteId, orders, nonReturnedlist, isPurchased) => {
    const { navigation, showFreeSeverTip } = this.props
    if (isPurchased) {
      navigation.navigate('ToteBuyClothesDetails', {
        toteProduct: product,
        toteId,
        order: product.order
      })
    } else {
      navigation.navigate('ToteBuyClothes', {
        toteProduct: product,
        toteId,
        orders,
        nonReturnedlist,
        showFreeSeverTip
      })
    }
  }

  _pushToMyCustomerPhotos = toteId => {
    const {
      navigation,
      currentCustomerStore: { customerPhotoIncentiveDetail }
    } = this.props
    if (customerPhotoIncentiveDetail) {
      navigation.navigate('WebPage', {
        toteId,
        uri: customerPhotoIncentiveDetail.link_url,
        hideShareButton: true,
        replace: true
      })
    } else this.props.navigation.navigate('MyCustomerPhotos', { toteId })

    Statistics.onEvent({
      id: 'photos_button_in_tote',
      label: '衣箱页晒单按钮',
      attributes: {
        buttonText: customerPhotoIncentiveDetail
          ? customerPhotoIncentiveDetail.incentive_hint
          : '晒单按钮'
      }
    })
  }

  _rateTote = tote => {
    const { navigation } = this.props
    navigation.navigate('ToteRatingDetails', { tote })
  }

  _rateService = tote => {
    const { navigation } = this.props
    navigation.navigate('RateService', { tote })
  }

  _returnTote = tote => {
    const scheduled_at = tote.scheduled_at
    const outOfReturnTime =
      new Date(scheduled_at).getTime() > new Date().getTime()
    if (scheduled_at && outOfReturnTime) {
      const { modalStore } = this.props
      let time = format(scheduled_at, 'M月D日HH点m分')
      modalStore.show(
        <CustomAlertView
          message={`衣箱签收还未超过48小时\n${time}后即可预约归还`}
          cancel={{ title: '取消', type: 'highLight' }}
        />
      )
      return
    }
    const { currentCustomerStore, extendCancelQuiz } = this.props
    const {
      freeService,
      subscription,
      subscriptionDate,
      isValidSubscriber,
      inFirstMonthAndMonthlySubscriber
    } = currentCustomerStore
    const params = {
      customer: {
        freeService,
        subscription,
        subscriptionDate,
        isValidSubscriber,
        inFirstMonthAndMonthlySubscriber
      },
      currentTotes: this.state.currentTotesData,
      tote,
      hanldeToteReturn: tote => {
        this._hanldeToteReturn(tote)
        Statistics.onEvent({
          id: 'enter_returnTote',
          label: '进入预约归还界面'
        })
      },
      joinMember: this._joinMember,
      extendCancelQuiz,
      visitExtendCancelQuiz: this._visitExtendCancelQuiz,
      openFreeService: this._openFreeService
    }
    let { isShowedHint } = toteReturnHint(params)
    if (isShowedHint) {
      return
    }
    this._hanldeToteReturn(tote)
    Statistics.onEvent({ id: 'enter_returnTote', label: '进入预约归还界面' })
  }

  _visitExtendCancelQuiz = (data, tote) => {
    const { navigation, visitExtendCancelQuiz } = this.props
    navigation.navigate('WebPage', {
      uri: data.url,
      hideShareButton: true,
      onFinishedQuiz: () => {
        this._hanldeToteReturn(tote)
        Statistics.onEvent({
          id: 'enter_returnTote',
          label: '进入预约归还界面'
        })
      }
    })
    visitExtendCancelQuiz && visitExtendCancelQuiz()
  }

  _joinMember = () => {
    this.props.navigation.navigate('JoinMember', { successRoute: 'Totes' })
  }

  _openFreeService = () => {
    this.props.navigation.navigate('OpenFreeService')
    Statistics.onEvent({
      id: 'freeservice_suitcase_reservation',
      label: '衣箱页预约归还弹窗点击去开通自在选'
    })
  }

  _hanldeToteReturn = tote => {
    const { navigation } = this.props
    const { tote_rating, perfect_closets, skip_perfect_closet } = tote
    if (tote_rating) {
      if (!!perfect_closets.length || skip_perfect_closet) {
        navigation.navigate('ToteReturn', { tote })
      } else {
        navigation.navigate('SatisfiedProduct', { tote })
      }
    } else {
      navigation.navigate('RateTote', { tote })
    }
  }

  _returnPreTote = () => {
    const { currentTotesData } = this.state
    const preTote = currentTotesData[1]
    this._hanldeToteReturn(preTote)
    Statistics.onEvent({ id: 'enter_returnTote', label: '进入预约归还界面' })
  }

  _onlyReturnToteFreeService = tote => {
    this.props.navigation.navigate('ToteReturn', {
      tote,
      isOnlyReturnToteFreeService: true
    })
  }

  _linkToToteFreeServiceHelp = () => {
    this.props.navigation.navigate('FreeServiceHelp')
  }

  //查看物流信息
  _showExpressInformation = tote => {
    const { navigation } = this.props
    navigation.navigate('ExpressInformation', {
      tracking_code: tote.outbound_shipping_code,
      toteId: tote.id
    })
  }

  _markToteDelivered = tote => {
    const { modalStore } = this.props
    modalStore.show(
      <CustomAlertView
        message={'请确认你已收到衣箱'}
        cancel={{ title: '取消', type: 'normal' }}
        other={[
          {
            title: '确定',
            type: 'highLight',
            onClick: () => {
              this._reportMarkToteDelivered(tote)
            }
          }
        ]}
      />
    )
    return
  }

  _reportMarkToteDelivered = tote => {
    const input = { tote_id: tote.id }
    Mutate(
      SERVICE_TYPES.totes.MUTATION_TOTE_MARK_DELIVERED,
      { input },
      response => {
        if (response.errors) {
          this._handleToteErrors(response.errors[0])
        } else {
          DeviceEventEmitter.emit('refreshHomeFloatHover')
          const { onRefresh } = this.props
          onRefresh && onRefresh()
        }
      }
    )
  }

  _handleToteErrors = message => {
    const { modalStore } = this.props
    modalStore.show(
      <CustomAlertView
        message={message}
        cancel={{ title: '确定', type: 'normal' }}
      />
    )
  }

  _gotoReturnToteDetail = (tote, scheduledReturnType) => {
    const { navigation } = this.props
    navigation.navigate('ToteReturnDetail', { tote, scheduledReturnType })
  }

  _fillInTrackingNumber = (tote, scheduledReturnType) => {
    this.props.navigation.navigate('TrackingNumberInput', {
      tote,
      scheduledReturnType
    })
  }

  render() {
    const { currentTotesData } = this.state
    const { isHasAbnormal, navigation, currentCustomerStore } = this.props
    if (!currentTotesData) {
      return null
    }
    if (!currentTotesData.length && !isHasAbnormal) {
      return (
        <ToteEmpty
          navigation={navigation}
          displayCartEntry={currentCustomerStore.displayCartEntry}
        />
      )
    }
    return (
      <View style={styles.container}>
        {!!currentTotesData.length &&
          currentTotesData.map((item, index) => {
            return (
              <ToteCurrentCollectionItem
                tote={item}
                didSelectedItem={this._didSelectedItem}
                key={index}
                rateTote={this._rateTote}
                rateService={this._rateService}
                showExpressInformation={this._showExpressInformation}
                toteBuyProduct={this._toteBuyProduct}
                pushToMyCustomerPhotos={this._pushToMyCustomerPhotos}
                returnTote={this._returnTote}
                returnPreTote={this._returnPreTote}
                markToteDelivered={this._markToteDelivered}
                gotoReturnToteDetail={this._gotoReturnToteDetail}
                fillInTrackingNumber={this._fillInTrackingNumber}
                onlyReturnToteFreeService={this._onlyReturnToteFreeService}
                linkToToteFreeServiceHelp={this._linkToToteFreeServiceHelp}
              />
            )
          })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16
  }
})
