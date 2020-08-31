import React, { Component } from 'react'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import ActionButton from 'src/app/components/shared/action_button/index'
import TipsModal from 'src/app/containers/schedule_return/tips_modal'
import AutoPickupOrSelfDelivery from '../auto_pickup_or_self_delivery'
import '../index.scss'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions.js'
import PageHelmet from 'src/app/lib/pagehelmet'
import Hint from 'src/app/components/hint'
import { isValidChineseName } from 'src/app/lib/validators.js'
import ValidAddress from 'src/app/lib/validAddress'

function mapStateToProps(state, props) {
  const { app, totes, customer } = state
  const { toteId } = props.location.query
  let currentTote = _.find(totes.current_totes, v => {
    return v.id === Number(toteId)
  })
  return {
    isMobile: app.platform !== 'wechat_pc',
    totes: totes,
    currentTote,
    ...customer,
    isWechat: app.isWechat,
    isMiniApp: app.platform === 'mini_app'
  }
}
@connect(mapStateToProps)
export default class ModifyScheduleReturn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      didBooked: false,
      isCommitting: false,
      isShow: false,
      isShowInvalidNameHint: false,
      scheduleReturnError: false
    }
    this.dateTime = null
    this.defaultZipCode = '518001'
    this.address = null
    this.addressRefs = null
    this.loading = false
    this.handleAddress = () => {}
  }

  componentDidMount() {
    const { dispatch, currentTote } = this.props
    if (_.isEmpty(currentTote)) {
      dispatch(Actions.totes.fetchLatestRentalAndPurchaseTote())
      dispatch(Actions.totes.fetchPastTotes(1))
    }
    dispatch(Actions.orders.fetchOrders())
  }

  scheduleReturnAutoPickup = () => {
    const { isValid, addressInfo } = this.address
    const { dispatch } = this.props
    if (addressInfo && !isValidChineseName(addressInfo.full_name)) {
      this.setState({
        isShowInvalidNameHint: true
      })
      return null
    }
    const newAddress = ValidAddress({ ...this.address.addressInfo })
    if (newAddress.isUnValid) {
      dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: '抱歉暂不支持该城市'
        })
      )
      return null
    }
    if (!isValid) {
      dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: '请选择取件地址'
        })
      )
    } else if (!this.dateTime) {
      dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: '请选择取件时间'
        })
      )
    } else {
      this.paddingToScheduleReturnAutoPickup()
    }
  }

  updateDateTime = time => {
    this.dateTime = time
  }
  updateCustomerShppingAddress = shippingAddresses => {
    this.address = shippingAddresses
  }

  paddingToScheduleReturnAutoPickup = () => {
    if (this.loading) {
      return null
    }
    this.loading = true
    this.setState({ isSubmit: true }, () => {
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

  handleScheduleToteError = (dispatch, res) => {
    const { errors } = res
    this.props.dispatch(
      Actions.tips.changeTips({
        isShow: true,
        content: errors[0].message
      })
    )
    this.loading = false
    this.setState({
      isSubmit: false
    })
  }

  verifyAddreddRefFn = handleAddress => {
    this.handleAddress = handleAddress
  }

  handleAddressModifyName = () => {
    this.setState(
      {
        isShowInvalidNameHint: false
      },
      this.handleAddress
    )
  }

  hideInvalidNameHint = () => {
    this.setState({
      isShowInvalidNameHint: false
    })
  }

  handleScheduleToteSuccess = (dispatch, response) => {
    this.loading = false
    const errorsMessages = response.data.ScheduleAutoPickup.errors
    if (errorsMessages.length) {
      this.setState({ scheduleReturnError: true, isSubmit: false }, () => {
        this.scheduleReturnErrorMessage = errorsMessages[0].message
      })
      return null
    }
    this.setState({ isSubmit: false })
    this.closePage()
  }

  closePage = () => {
    const { router, location } = this.props
    const { query } = location
    if (query.prePageName === 'totes') {
      router.go(-1)
    } else {
      router.go(-2)
    }
  }

  pickInputForScheduleReturnAutoPickup = () => {
    const { location, currentTote } = this.props
    const { scheduledReturnType } = location.query
    const { scheduled_return, tote_free_service } = currentTote
    const isOnlyReturnToteFreeService =
      scheduledReturnType === 'tote_free_service_scheduled_return'
    const toteFreeService = isOnlyReturnToteFreeService
      ? tote_free_service
      : scheduled_return.tote_free_service
    const toteFreeServiceId = toteFreeService && toteFreeService.id
    const returnSlotCount = toteFreeService && toteFreeService.return_slot_count
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
        input = {
          tote_id: scheduled_return.tote.id,
          ...bookingInfo
        }
      }
    }
    return input
  }

  render() {
    const {
      currentTote,
      isWechat,
      isMiniApp,
      location,
      shipping_address
    } = this.props
    if (_.isEmpty(currentTote)) {
      return null
    }
    return (
      <div className="order">
        <PageHelmet title="更改预约" link="/schedule_return" />
        <div className={'modify-schudle-title'}>{'上门取件'}</div>
        <div className="mid">
          <AutoPickupOrSelfDelivery
            isWechat={isWechat}
            isMiniApp={isMiniApp}
            location={location}
            tote={currentTote}
            updateScheduledPickupsType={this.updateScheduledPickupsType}
            updateDateTime={this.updateDateTime}
            verifyAddreddRefFn={this.verifyAddreddRefFn}
            shipping_address={shipping_address}
            hideSelectButton={true}
            updateCustomerShppingAddress={this.updateCustomerShppingAddress}
          />
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
        {this.state.scheduleReturnError && this.scheduleReturnErrorMessage && (
          <TipsModal
            title={this.scheduleReturnErrorMessage}
            singleBtn="确定"
            singleBtnClick={this.closePage}
          />
        )}
        <StickyButtonContainer>
          <ActionButton
            size={'stretch'}
            onClick={this.scheduleReturnAutoPickup}
          >
            {this.state.isSubmit ? '提交预约信息中...' : '确认提交'}
          </ActionButton>
        </StickyButtonContainer>
      </div>
    )
  }
}
