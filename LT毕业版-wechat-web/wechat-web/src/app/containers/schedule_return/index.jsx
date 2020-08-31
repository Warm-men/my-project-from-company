import React, { Component } from 'react'
import { connect } from 'react-redux'
import ToteProducts from 'src/app/containers/totes/confirm_totes/products'
import Actions from 'src/app/actions/actions.js'
import { browserHistory } from 'react-router'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import ActionButton from 'src/app/components/shared/action_button/index'
import PageHelmet from 'src/app/lib/pagehelmet'
import TipsModal from 'src/app/containers/schedule_return/tips_modal'
import ValidAddress from 'src/app/lib/validAddress'
import { isValidChineseName } from 'src/app/lib/validators.js'
import Hint from 'src/app/components/hint'
import Alert from 'src/app/components/alert/index.jsx'
import { withRouter } from 'react-router'
import AutoPickupOrSelfDelivery from './auto_pickup_or_self_delivery'
import ToteFreeService from 'src/app/components/schedule_return/tote_free_service/tote_free_service'
import delay from 'src/app/lib/delay.js'
import UnreturnToteParts from 'src/app/components/schedule_return/unreturn_tote_parts'
import 'src/assets/stylesheets/components/desktop/totes/totes_container.scss'
import 'src/app/components/custom_components/swiper.scss'
import './index.scss'

function mapStateToProps(state, props) {
  const { app, totes, customer, orders } = state
  const isHadOrders = orders.orders.length > 0
  // NOTE:再次预约则用pastTotes，首次就用latest_rental_tote
  const { toteId } = props.location.query
  let currentTote = _.find(totes.current_totes, v => {
    return v.id === Number(toteId)
  })
  return {
    isMobile: app.platform !== 'wechat_pc',
    totes: totes,
    currentTote,
    ...customer,
    isHadOrders,
    isWechat: app.isWechat,
    isMiniApp: app.platform === 'mini_app'
  }
}

@connect(mapStateToProps)
@withRouter
export default class ScheduleReturn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false,
      isSubmit: false,
      hideOrdersModal: false,
      isShowInvalidNameHint: false,
      isShowNoun: false,
      freeServiceReturnType: 'allLeft',
      scheduleReturnError: false,
      toteProducts: [],
      showTips: false
    }
    this.scheduledPickupsType = 'scheduled_auto_pickup'
    this.dateTime = null
    this.address = null
    this.addressRefs = null
    this.loading = false
    this.defaultZipCode = '518001'
    this.handleAddress = () => {}
    this.productParts = null
  }

  componentDidMount() {
    const { dispatch, currentTote } = this.props
    const { isOnlyReturnToteFreeService } = this.props.location.query
    if (!isOnlyReturnToteFreeService) {
      const isShowRemindTFS = this.isShowRemindTFS()
      if (isShowRemindTFS) {
        this._showFreeServiceHint()
      }
    }
    if (_.isEmpty(currentTote)) {
      dispatch(Actions.totes.fetchLatestRentalAndPurchaseTote())
      dispatch(Actions.totes.fetchPastTotes(1))
    }
    dispatch(Actions.orders.fetchOrders())
    this.checkReturnedToteProduct()
    this.fetchUnreturnToteParts()
  }

  isShowRemindTFS = () => {
    const { totes, currentTote } = this.props
    const isAllToteDelivered = totes.current_totes.find(item => {
      return item.progress_status.status !== 'delivered'
    })
    const toteFreeService = currentTote.scheduled_return.tote_free_service
    const freeServiceState =
      toteFreeService &&
      toteFreeService.hint &&
      toteFreeService.hint.state === 'schedule_with_prev_tote'
    const remindTFS =
      totes.current_totes.length === 2 &&
      !isAllToteDelivered &&
      freeServiceState
    return remindTFS
  }

  _showFreeServiceHint = () => {
    const { customer_nth_tote } = this.props.currentTote
    const { free_service } = this.props
    if (
      free_service &&
      free_service.state === 'active' &&
      customer_nth_tote < 4
    ) {
      this.setState({ showTips: true })
    }
  }

  fetchUnreturnToteParts = () => {
    const { dispatch, currentTote } = this.props
    const tote_id = currentTote.id
    dispatch(
      Actions.totes.queryUnreturnToteParts({ tote_id }, (dis, res) => {
        this.productParts = res.data.unreturn_tote_parts
      })
    )
  }

  checkReturnedToteProduct = () => {
    const { tote_products } = this.props.currentTote
    const toteProducts = tote_products.filter(({ transition_state }) => {
      return transition_state !== 'purchased' && transition_state !== 'returned'
    })
    this.setState({ toteProducts })
  }

  handleConfirmReturn = () => {
    if (this.scheduledPickupsType === 'scheduled_auto_pickup') {
      const { query } = this.props.location
      const isOnlyReturnToteFreeService =
        query && query.isOnlyReturnToteFreeService
      if (!!isOnlyReturnToteFreeService) {
        const { freeServiceReturnType } = this.state
        if (freeServiceReturnType === 'allLeft') {
          this.scheduledPickupsType = 'scheduled_self_delivery'
          this.penddingToScheduledReturnSelfDelivery()
        } else {
          this.scheduleReturnAutoPickup()
        }
        return null
      }
      this.scheduleReturnAutoPickup()
    } else {
      this.scheduledReturnSelfDelivery()
    }
  }

  hasProductParts = () => {
    if (_.isEmpty(this.productParts)) return false
    const { current, history } = this.productParts
    if (
      !_.isEmpty(current.product_parts) ||
      !_.isEmpty(history.product_parts)
    ) {
      return true
    } else {
      return false
    }
  }

  scheduleReturnAutoPickup = () => {
    const { isValid, addressInfo } = this.address
    const { dispatch, location } = this.props
    if (addressInfo && !isValidChineseName(addressInfo.full_name)) {
      this.setState({ isShowInvalidNameHint: true })
      return null
    }
    const newAddress = ValidAddress({ ...this.address.addressInfo })
    if (newAddress.isUnValid) {
      dispatch(
        Actions.tips.changeTips({ isShow: true, content: '抱歉暂不支持该城市' })
      )
      return null
    }
    const isOnlyReturnToteFreeService =
      location.query.isOnlyReturnToteFreeService
    const hasProductParts = this.hasProductParts()
    if (this.address && this.state.dateTime) {
      if (hasProductParts && !isOnlyReturnToteFreeService) {
        // NOTE：配件提示
        this.setState({ isShowNoun: true })
      } else {
        this.paddingToScheduleReturnAutoPickup()
      }
    } else if (!isValid) {
      dispatch(
        Actions.tips.changeTips({ isShow: true, content: '请选择取件地址' })
      )
    } else if (!this.dateTime) {
      dispatch(
        Actions.tips.changeTips({ isShow: true, content: '请选择取件时间' })
      )
    } else if (hasProductParts && !isOnlyReturnToteFreeService) {
      // NOTE：配件提示
      this.setState({ isShowNoun: true })
    } else {
      this.paddingToScheduleReturnAutoPickup()
    }
  }

  updateCustomerShppingAddress = shippingAddresses => {
    this.address = shippingAddresses
  }

  updateScheduledPickupsType = type => {
    this.scheduledPickupsType = type
  }

  paddingToScheduleReturnAutoPickup = () => {
    if (this.loading) {
      return null
    }
    this.loading = true
    this.setState({ isSubmit: true, isShowNoun: false }, () => {
      this.handleScheduleReturnAutoPickup()
    })
  }

  handleScheduleReturnAutoPickup = () => {
    let input = this.pickInputForScheduleReturnAutoPickup()
    this.props.dispatch(
      Actions.totes.scheduleReturnAutoPickup(
        { ...input },
        this.handleScheduleToteSuccess,
        this.handleScheduleToteError
      )
    )
  }

  pickInputForScheduleReturnAutoPickup = () => {
    const { location, currentTote } = this.props
    const { isOnlyReturnToteFreeService } = location.query
    const { scheduled_return, tote_free_service } = currentTote
    const toteFreeService = isOnlyReturnToteFreeService
      ? tote_free_service
      : scheduled_return.tote_free_service
    const toteFreeServiceId = toteFreeService && toteFreeService.id
    const returnSlotCount =
      this.state.freeServiceReturnType === 'allLeft' ? 0 : 2
    const {
      address,
      state,
      city,
      district,
      zip_code,
      telephone,
      full_name
    } = ValidAddress({ ...this.address.addressInfo })
    const bookingInfo = {
      requested_pickup_at: this.dateTime,
      pickup_address: {
        address_1: address,
        address_2: address,
        city,
        country: 'CN',
        district,
        full_name,
        state,
        telephone,
        zip_code: zip_code ? zip_code : this.defaultZipCode
      }
    }
    let input = null
    if (isOnlyReturnToteFreeService && toteFreeServiceId) {
      //单独归还自在选
      input = {
        ...bookingInfo,
        tote_free_service: {
          id: toteFreeServiceId,
          return_slot_count: returnSlotCount
        }
      }
    } else {
      if (toteFreeServiceId) {
        //自在选与衣箱同时归还
        input = {
          tote_id: scheduled_return.tote.id,
          ...bookingInfo,
          tote_free_service: {
            id: toteFreeServiceId,
            return_slot_count: returnSlotCount
          }
        }
      } else {
        //单独归还衣箱
        input = { tote_id: scheduled_return.tote.id, ...bookingInfo }
      }
    }
    return input
  }

  pickInputForScheduleReturnSelfDelivery = () => {
    const { location, currentTote } = this.props
    const { isOnlyReturnToteFreeService } = location.query
    const { scheduled_return, tote_free_service } = currentTote
    const toteFreeService = isOnlyReturnToteFreeService
      ? tote_free_service
      : scheduled_return.tote_free_service
    const toteFreeServiceId = toteFreeService && toteFreeService.id
    const returnSlotCount =
      this.state.freeServiceReturnType === 'allLeft' ? 0 : 2

    let input = null
    if (isOnlyReturnToteFreeService && toteFreeServiceId) {
      //单独自寄归还自在选
      input = {
        tote_free_service: {
          id: toteFreeServiceId,
          return_slot_count: returnSlotCount
        }
      }
    } else {
      if (toteFreeServiceId) {
        //自寄归还自在选和衣箱
        input = {
          tote_id: scheduled_return.tote.id,
          tote_free_service: {
            id: toteFreeServiceId,
            return_slot_count: returnSlotCount
          }
        }
      } else {
        //自寄归还衣箱
        input = { tote_id: scheduled_return.tote.id }
      }
    }
    return input
  }

  handleScheduleToteSuccess = async (dispatch, response) => {
    this.loading = false
    const errorsMessages =
      this.scheduledPickupsType === 'scheduled_auto_pickup'
        ? response.data.ScheduleAutoPickup.errors
        : response.data.ScheduleSelfDelivery.errors
    if (errorsMessages.length) {
      this.scheduleReturnErrorMessage = errorsMessages[0].message
      this.setState({ scheduleReturnError: true, isSubmit: false })
      return null
    }
    const { location, currentTote } = this.props
    const { isOnlyReturnToteFreeService } = location.query
    const { display_rate_incentive_guide } = currentTote
    if (display_rate_incentive_guide && !isOnlyReturnToteFreeService) {
      this.scheduledReturnDone()
    } else {
      this.props.dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: '提交成功',
          timer: 1.5,
          image: require('src/app/containers/real_name_auth/images/success.svg')
        })
      )
      await delay(1500)
      this.closePage()
    }
    this.setState({ isSubmit: false })
  }

  handleScheduleToteError = (dispatch, res) => {
    const { errors } = res
    this.props.dispatch(
      Actions.tips.changeTips({ isShow: true, content: errors[0].message })
    )
    this.loading = false
    this.setState({ isSubmit: false })
  }

  closePage = () => {
    this.scheduleReturnErrorMessage = null
    browserHistory.replace('/totes')
  }

  scheduledReturnDone = () => {
    const { currentTote } = this.props
    const path = {
      pathname: '/schedule_return_done',
      query: { tote_id: currentTote.id }
    }
    browserHistory.replace(path)
  }

  updateDateTime = time => {
    this.dateTime = time
  }
  updatefreeServiceReturnType = type => {
    this.setState({ freeServiceReturnType: type })
  }

  dissOrderTip = () => {
    this.setState({ hideOrdersModal: true, isSubmit: false })
  }

  gotoOrders = () => browserHistory.push('/payment_pending')

  hideTipsAlert = () => this.setState({ showTips: false })

  verifyAddreddRefFn = handleAddress => {
    this.handleAddress = handleAddress
  }

  hideInvalidNameHint = () => {
    this.setState({ isShowInvalidNameHint: false })
  }

  handleAddressModifyName = () => {
    this.setState({ isShowInvalidNameHint: false }, this.handleAddress)
  }

  scheduledReturnSelfDelivery = () => {
    const { location } = this.props
    const isOnlyReturnToteFreeService =
      location.query.isOnlyReturnToteFreeService
    const hasProductParts = this.hasProductParts()
    if (hasProductParts && !isOnlyReturnToteFreeService) {
      this.setState({ isShowNoun: true })
    } else {
      this.penddingToScheduledReturnSelfDelivery()
    }
  }

  penddingToScheduledReturnSelfDelivery = () => {
    this.setState({ isSubmit: true, isShowNoun: false }, () => {
      this.handleScheduleReturnSelfDelivery()
    })
  }

  handleScheduleReturnSelfDelivery = () => {
    if (this.loading) {
      return null
    }
    this.loading = true
    let input = this.pickInputForScheduleReturnSelfDelivery()
    this.props.dispatch(
      Actions.totes.scheduleReturnSelfDelivery(
        { ...input },
        this.handleScheduleToteSuccess,
        this.handleScheduleToteError
      )
    )
  }

  render() {
    const {
      currentTote,
      isWechat,
      isMiniApp,
      location,
      isHadOrders,
      shipping_address,
      totes
    } = this.props
    const isShowOrders = !this.state.hideOrdersModal && isHadOrders
    if (_.isEmpty(currentTote)) {
      return null
    }
    const hasToteFreeService = currentTote.scheduled_return.tote_free_service
    const productListViewStyle = !hasToteFreeService
      ? 'productListView topBorder'
      : 'productListView'
    const handleProductPartOnClick =
      this.scheduledPickupsType === 'scheduled_auto_pickup'
        ? this.paddingToScheduleReturnAutoPickup
        : this.penddingToScheduledReturnSelfDelivery
    const { isOnlyReturnToteFreeService } = location.query
    const isOnlyReturnToteFreeServiceLeftAll =
      isOnlyReturnToteFreeService &&
      this.state.freeServiceReturnType === 'allLeft'
    const { state } = (hasToteFreeService && hasToteFreeService.hint) || {}
    const didntComplete =
      state &&
      state !== 'complete_with_purchase' &&
      state !== 'complete_with_return'
    return (
      <div className="order">
        <PageHelmet title="预约归还" link="/schedule_return" />
        {((!!hasToteFreeService && didntComplete) ||
          !!isOnlyReturnToteFreeService) && (
          <ToteFreeService
            updatefreeServiceReturnType={this.updatefreeServiceReturnType}
            isOnlyReturnToteFreeService={!!isOnlyReturnToteFreeService}
            totes={totes}
            currentTote={currentTote}
          />
        )}
        <div className="mid">
          {!isOnlyReturnToteFreeService && (
            <div className={productListViewStyle}>
              <div className={'productListTitle'}>待归还衣箱</div>
              <ToteProducts
                column={'ReturnTote'}
                products={this.state.toteProducts}
              />
            </div>
          )}
          {!isOnlyReturnToteFreeServiceLeftAll && (
            <AutoPickupOrSelfDelivery
              isWechat={isWechat}
              isMiniApp={isMiniApp}
              location={location}
              tote={currentTote}
              updateScheduledPickupsType={this.updateScheduledPickupsType}
              updateDateTime={this.updateDateTime}
              verifyAddreddRefFn={this.verifyAddreddRefFn}
              shipping_address={shipping_address}
              updateCustomerShppingAddress={this.updateCustomerShppingAddress}
              isOnlyReturnToteFreeService={isOnlyReturnToteFreeService}
            />
          )}
        </div>
        {this.state.isShowInvalidNameHint && (
          <Hint
            content="根据国家主管部门要求实行实名收寄，请填写真实姓名"
            leftBtnText="取消"
            rightBtnText="去修改"
            leftButton={this.hideInvalidNameHint}
            rightButton={this.handleAddressModifyName}
          />
        )}
        {isShowOrders && (
          <Hint
            content="你有待支付的订单，未处理不能开启下个衣箱；如忘了归还，请跟随现有衣箱一起寄回"
            leftBtnText="跟随衣箱归还"
            rightBtnText="去付款"
            leftButton={this.dissOrderTip}
            rightButton={this.gotoOrders}
          />
        )}
        {this.state.showTips && (
          <Alert
            content="新衣箱的自在选请随本衣箱一起寄回"
            btnText="好的"
            handleClick={this.hideTipsAlert}
          />
        )}
        {this.state.scheduleReturnError && this.scheduleReturnErrorMessage && (
          <TipsModal
            title={this.scheduleReturnErrorMessage}
            singleBtn="确定"
            singleBtnClick={this.closePage}
          />
        )}
        {this.state.isShowNoun && (
          <Alert
            btnText="好的"
            alertPaddingFix="alert_padding_fix"
            handleClick={handleProductPartOnClick}
          >
            <UnreturnToteParts message={this.productParts} />
          </Alert>
        )}
        <StickyButtonContainer>
          <ActionButton size={'stretch'} onClick={this.handleConfirmReturn}>
            {this.state.isSubmit ? '提交预约信息中...' : '确认提交'}
          </ActionButton>
        </StickyButtonContainer>
      </div>
    )
  }
}
