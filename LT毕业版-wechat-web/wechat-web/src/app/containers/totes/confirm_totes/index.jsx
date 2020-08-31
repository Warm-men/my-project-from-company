import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import Actions from 'src/app/actions/actions.js'
import ToteProducts from 'src/app/containers/totes/confirm_totes/products'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import TipsModal from 'src/app/containers/schedule_return/tips_modal'
import Hint from 'src/app/components/hint'
import ActionButton from 'src/app/components/shared/action_button/index'
// import WxAddress from 'src/app/components/wx_address/index'
import WxAddress from 'src/app/components/wx_address_v2'
import ValidAddress from 'src/app/lib/validAddress'
import { isValidChineseName } from 'src/app/lib/validators.js'
import { parseHashString } from 'src/app/lib/parseHashString.js'
import 'src/app/components/custom_components/swiper.scss'
import './index.scss'
import LoadingPopu from './loading_popu'
import { MigrationAlert } from './migration'
import { MIGRATION_JSON_PATH } from '../../../constants/global_config'

const getState = state => {
  const { customer, toteSwap, app, tote_cart } = state
  return {
    ...customer,
    tote: state.toteSwap.tote,
    locking: toteSwap.locking,
    isWechat: app.isWechat,
    isMiniApp: app.platform === 'mini_app',
    tote_cart
  }
}

@connect(getState)
class ComfirmTotes extends Component {
  constructor() {
    super()
    this.state = {
      isValid: false,
      validModal: false,
      unValidModal: false,
      isValidLock: true,
      isSubmit: false,
      isShowHint: false,
      isLoading: false,
      isShowCircleIcon: true,
      isMigration: false
    }
    this.address = {}
    this.addressRefs = null
    this.timer = null
  }

  componentWillMount() {
    this.getLatestTote()
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  componentWillReceiveProps(nextProps) {
    // NOTE：衣箱已经Pulled再来下单就回去totes界面
    if (nextProps.tote.state === 'pulled') {
      browserHistory.replace('totes')
    }
  }

  getLatestTote = () => this.props.dispatch(Actions.totes.fetchLatest())

  handleTipsModal = () => {
    const { isValid, addressInfo } = this.address
    if (!isValidChineseName(addressInfo.full_name)) {
      this.setState({ isShowHint: true })
      return null
    }
    if (!isValid) {
      this.props.dispatch(
        Actions.tips.changeTips({ isShow: true, content: '请选择取件地址' })
      )
      return
    }
    const newAddress = ValidAddress({ ...addressInfo })
    if (newAddress.isUnValid) {
      this.props.dispatch(
        Actions.tips.changeTips({ isShow: true, content: '抱歉暂不支持该城市' })
      )
      return
    }
    this.handleSubmit()
  }

  hideTipsModal = () => {
    this.setState({ unValidModal: false, validModal: false })
  }

  handleSubmit = () => {
    this.hideTipsModal()
    this.setState({ isSubmit: true })
    if (
      this.isHasShippingAddress() &&
      !this.address.isChanged &&
      !this.isHasQueryData()
    ) {
      //had default shipping address
      this.handleComfirmToteSuccess()
    } else {
      const { dispatch } = this.props,
        {
          address,
          state,
          city,
          district,
          zip_code,
          telephone,
          full_name
        } = ValidAddress({ ...this.address.addressInfo })
      if (this.address.isChanged) {
        //当shipping_address 不存在或者address_1与微信拿的address不一样时更新
        const action = Actions.updateShippingAddress({
          shipping_address: {
            address_1: address,
            address_2: address,
            state: state,
            city: city,
            district: district,
            zip_code: zip_code,
            telephone: telephone,
            full_name: full_name,
            country: 'CN'
          },
          error: this.handleComfirmError,
          success: this.handleComfirmToteSuccess
        })
        dispatch(action)
      } else {
        //有就不用跟新
        this.handleComfirmToteSuccess()
      }
    }
  }

  handleComfirmError = () =>
    Actions.tips.changeTips({ isShow: true, content: '更新失败！' })

  handleComfirmToteSuccess = () => {
    const {
      address,
      state,
      city,
      district,
      zip_code,
      telephone,
      full_name
    } = ValidAddress({ ...this.address.addressInfo })
    const shipping_address = {
      city,
      state,
      district,
      zip_code,
      telephone,
      full_name,
      country: 'CN',
      address_1: address,
      address_2: address
    }
    const input = { shipping_address, category_rule_flag: true }
    this.props.dispatch(
      Actions.toteCart.toteCartPlaceOrder(input, (dispatch, response) => {
        const { errors, tote } = response.data.ToteCartPlaceOrder
        if (errors && errors.length) {
          const { message } = errors[0]
          dispatch(Actions.tips.changeTips({ isShow: true, content: message }))
          this.setState({ isSubmit: false })
          return null
        }
        this.handleToteLockSuccessNext(tote.id)
      })
    )
  }

  linkToMigrationUrl = () => {
    window.location.href = MIGRATION_JSON_PATH
  }

  handleToteLockSuccessNext = tote_id => {
    this.props.dispatch(Actions.toteCart.queryToteCart())
    // NOTE: 邀请好友微信分享
    if (this.props.isMiniApp) {
      browserHistory.replace({
        pathname: '/confirm-totes-success',
        query: { tote_id }
      })
    } else {
      window.location.replace(
        `https://${window.location.host}/confirm-totes-success?tote_id=${tote_id}`
      )
    }
  }

  showLoadingTip = (loadingMessage, time, isShowCircleIcon) => {
    this.setState({ loadingMessage, isShowCircleIcon, isLoading: true })

    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.setState({ isLoading: false })
    }, time)
  }

  handleCancelHint = () =>
    this.setState(state => ({
      isValidLock: !state.isValidLock,
      isSubmit: !state.isSubmit
    }))

  gotoPreviewTote = () => browserHistory.push('/totes/preview')

  getAddressInfo = info => {
    this.address = info
    this.setState({ isValid: this.address.isValid })
  }

  activeButton = () =>
    this.state.isValid && !this.props.locking && !this.state.isSubmit

  isHasQueryData = () => {
    return !_.isEmpty(this.changeMiniAddress())
  }

  isHasShippingAddress = () => {
    const {
        full_name,
        telephone,
        state,
        city,
        district,
        address_1
      } = this.props.shipping_address,
      hasDefaultValue = !!(
        full_name &&
        telephone &&
        state &&
        city &&
        district &&
        address_1
      )
    return hasDefaultValue
  }

  defaultShippingAddress = () => {
    return this.isHasQueryData() || this.isHasShippingAddress()
  }

  handleChangeAddress = () => {
    this.addressRefs.handleAddress()
    this.hideHint()
  }

  hideHint = () => {
    this.setState({ isShowHint: false })
  }

  changeMiniAddress = () => {
    const { hash } = this.props.location
    if (_.isEmpty(hash)) {
      return {}
    }
    const hashValue = parseHashString(hash)
    return {
      full_name: hashValue.userName,
      zip_code: hashValue.postalCode,
      state: hashValue.provinceName,
      city: hashValue.cityName,
      district: hashValue.countyName,
      address_1: hashValue.detailInfo,
      nationalCode: hashValue.nationalCode,
      telephone: hashValue.telNumber
    }
  }

  handleDefaultData = () => {
    const shipping_address = { ...this.props.shipping_address }
    return { ...shipping_address, ...this.changeMiniAddress() }
  }

  render() {
    const { tote, locking, isWechat, isMiniApp, tote_cart } = this.props
    if (_.isEmpty(tote_cart)) {
      return null
    }
    const products = [
      ...tote_cart['clothing_items'],
      ...tote_cart['accessory_items']
    ]
    return (
      <div className="submit-totes">
        <PageHelmet title="下单衣箱" link="/confirm-totes" />
        {this.state.isMigration && (
          <MigrationAlert linkToMigrationUrl={this.linkToMigrationUrl} />
        )}
        {this.state.isLoading && (
          <LoadingPopu
            isShowCircleIcon={this.state.isShowCircleIcon}
            text={this.state.loadingMessage}
          />
        )}
        <div className="mid">
          <WxAddress
            ref={refs => (this.addressRefs = refs)}
            isWechat={isWechat}
            isMiniApp={isMiniApp}
            title="收件地址"
            tipText="请选择"
            isQueryData={this.isHasQueryData()}
            customer_shipping_address={this.handleDefaultData()}
            getAddressInfo={this.getAddressInfo}
            isShowInfo={this.state.isValid}
            hasDefaultValue={this.defaultShippingAddress()}
          />
          <div className="border-top">
            {!_.isEmpty(tote) && (
              <ToteProducts column={'ConfirmTote'} products={products} />
            )}
          </div>
          <div className="explain">
            <p className="explain-title">配送说明</p>
            <span>1、每天17点前下单，会在当天寄出</span>
            <span>2、晚于17点的订单，会在第二天寄出</span>
            <span>3、所有衣箱均由顺丰标快免费配送，提交后可查询配送状态</span>
            <span>
              4、如果你手上还有衣箱，我们将在确认归还（以顺丰揽件时间为准）后寄出新的衣箱
            </span>
          </div>
        </div>
        {this.state.isShowHint && (
          <Hint
            content="根据国家主管部门要求实行实名收寄，请填写真实姓名"
            leftBtnText="取消"
            rightBtnText="去修改"
            leftButton={this.hideHint}
            rightButton={this.handleChangeAddress}
          />
        )}
        {this.state.validModal && (
          <TipsModal
            title={`根据国家主管部门通知要求，近期对快件统一实行实名收寄，如不符合将会导致无法发货`}
            leftBtn="取消"
            rightBtn="确定"
            leftBtnClick={this.hideTipsModal}
            rightBtnClick={this.handleSubmit}
          />
        )}
        {this.state.unValidModal && (
          <TipsModal
            title={`根据国家主管部门通知要求，近期对快件统一实行实名收寄，如不符合将会导致无法发货，请检查你的收件人姓名`}
            singleBtn="确定"
            singleBtnClick={this.hideTipsModal}
          />
        )}
        {!this.state.isValidLock && (
          <Hint
            title="缺货提醒"
            content={this.lockError}
            leftBtnText="继续下单"
            rightBtnText="查看衣箱"
            leftButton={this.handleCancelHint}
            rightButton={this.gotoPreviewTote}
          />
        )}
        <StickyButtonContainer>
          <ActionButton
            disabled={!this.activeButton()}
            size="stretch"
            onClick={this.handleTipsModal}
          >
            {!locking ? '确认下单' : '正在确认...'}
          </ActionButton>
        </StickyButtonContainer>
      </div>
    )
  }
}

export default ComfirmTotes
