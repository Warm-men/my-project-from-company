import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions'
import CartProducts from 'src/app/containers/totes/new_totes/cart_products'
import CartProductsGuide from 'src/app/containers/totes/new_totes/guide'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import ActionButton from 'src/app/components/shared/action_button/index'
import Hint from 'src/app/components/hint'
import {
  getToteCartError,
  isNotShowErrorText
} from 'src/app/containers/totes/new_totes/utils/shopping_car_error.js'
import Alert from 'src/app/components/alert'
import * as storage from 'src/app/lib/storage.js'
import { isVacation } from 'src/app/lib/authentication.js'
import Popup from 'src/app/containers/totes/new_totes/popup'
import CartFreeServiceTitle from 'src/app/containers/totes/new_totes/cart_free_serive_title'
import OpenEntryBanner from 'src/app/containers/totes/new_totes/open_entry_banner'
import {
  ApplyFreeServiceToToteCart,
  RemoveFreeServiceFromToteCart
} from 'src/app/actions/independent/free_service_action.js'
import './index.scss'
import { differenceInDays, endOfDay } from 'date-fns'
import { MIGRATION_JSON_PATH } from '../../../constants/global_config'

const getState = state => ({
  customer: state.customer,
  tote_cart: state.tote_cart,
  isVacation: isVacation(state.customer),
  isJdEnv: state.app.platform === 'jd'
})

export default connect(getState)(NewTotes)
function NewTotes(props) {
  const toteCartGuide = !storage.get('ToteCartProductsGuide', localStorage)
  const { dispatch, isJdEnv, isVacation, tote_cart } = props
  if (tote_cart.state === 'populating') {
    browserHistory.replace('/onboarding_loading')
    return null
  }

  const [isShowGuide, setIsShowGuide] = useState(toteCartGuide || false)
  const [errorText, setErrorText] = useState('')
  const [isShowHint, setIsShowHint] = useState(false)
  const [isShowToteTooFastHint, setShowToteTooFastHint] = useState(false)
  const [toteTooFastHint, setToteTooFastHint] = useState('')
  const [hintObj, setHintObj] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertCode, setAlertCode] = useState('')
  const [alertContent, setAlertContent] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [showFreeServiceTips, setShowFreeServiceTips] = useState(false)
  const [error_code, setErrorCode] = useState('')
  const [isShowErrorText, setIsShowErrorText] = useState(false)
  const [alertTitle, setAlertTitle] = useState('')

  const initTips = tote_cart => {
    if (!tote_cart || !tote_cart.validate_result) return null

    const { errors } = tote_cart.validate_result
    if (errors && errors.length) {
      const errorObj = getToteCartError(tote_cart.validate_result)
      const error_code = errors[0].error_code

      // NOTE:京东环境不需要弹窗跳转到自在选
      if (isJdEnv && error_code === 'error_scheduled_pickup') return null

      if (_.isString(errorObj)) {
        // NOTE：用户身份验证不需要在购物车提示
        if (error_code === 'error_scheduled_pickup_without_free_service') {
          setAlertTitle('预约归还提醒')
          setAlertCode(error_code)
          setAlertContent(errorObj)
          return null
        }
        setErrorText(errorObj)
        setErrorCode(error_code)

        if (error_code === 'error_tote_category_rule_valid_fail') {
          return null
        }
        setIsShowErrorText(!_.includes(isNotShowErrorText, error_code))
      } else {
        setHintObj(errorObj)
        setErrorCode(error_code)
      }
    } else {
      if (errorText) {
        setErrorText('')
        setErrorCode('')
      }
    }
  }

  const queryToteCartData = () => {
    dispatch(
      Actions.toteCart.queryToteCart((patch, res) =>
        initTips(res.data.me.tote_cart)
      )
    )
  }

  useEffect(() => {
    queryToteCartData()
    dispatch(Actions.allproducts.resetFilters())
  }, [])

  useEffect(() => {
    initTips(props.tote_cart)
  }, [props.tote_cart])

  const handelHideGuide = () => {
    storage.set('ToteCartProductsGuide', true, localStorage)
    setIsShowGuide(false)
  }

  const gotoHome = () => browserHistory.push('/home')

  const handleGotoCollections = async () => {
    if (isVacation) {
      const url = '/customize/vacation'
      dispatch(Actions.toteSwap.clearFilters())
      await dispatch(Actions.toteSwap.clearProducts(url))
      dispatch(Actions.toteSwap.setToteSwapHeader(['vacation', 'collections']))
      browserHistory.push(url)
      return null
    }
    dispatch(Actions.toteSwap.setToteSwapHeader(['collections']))
    browserHistory.push('/customize/collections')
  }

  const toteUsedTooFast = () => {
    const { billing_date, totes_left, status } = props.customer.subscription
    const billingDate = endOfDay(billing_date)
    const leftSubscriptionTime = differenceInDays(billingDate, new Date())
    const isTooFast =
      totes_left > 0 &&
      status !== 'cancelled' &&
      status !== 'pending_hold' &&
      leftSubscriptionTime / totes_left > 18
    const hint = (
      <span>
        你的会员有效期还有
        <span style={{ color: '#121212', fontWeight: 500 }}>
          {leftSubscriptionTime}天
        </span>
        ，当前剩余
        <span style={{ color: '#121212', fontWeight: 500 }}>
          {totes_left}个
        </span>
        衣箱，确定继续下单新衣箱吗
      </span>
    )
    setToteTooFastHint(hint)
    return isTooFast
  }

  const lockTote = () => {
    // NOTE：身份验证优先级更高
    if (error_code === 'error_need_identity_authentication') {
      browserHistory.push('/real_name_auth')
      return null
    }
    if (errorText) {
      const tips = { isShow: true, content: errorText, timer: 2 }
      dispatch(Actions.common.changeToast(tips))
      return null
    }
    if (error_code === 'error_not_support_subscription_type') {
      window.location.href = MIGRATION_JSON_PATH
      return
    }
    if (alertCode === 'error_scheduled_pickup_without_free_service') {
      setShowAlert(true)
      return null
    }

    if (hintObj && !isShowHint) {
      setIsShowHint(true)
      return null
    }

    const isTooFast = toteUsedTooFast()
    if (isTooFast) {
      setShowToteTooFastHint(true)
      return null
    }

    dispatch(Actions.toteCart.queryToteCart(queryToteCartSuccess))
  }

  const queryToteCartSuccess = (_, res) => {
    const { popup, display_free_service_banner } = res.data.me.tote_cart
    if (
      popup &&
      display_free_service_banner &&
      !isJdEnv &&
      !isShowToteTooFastHint
    ) {
      setShowPopup(true)
    } else {
      browserHistory.replace('/confirm-totes')
    }
  }

  const closePopup = () => browserHistory.replace('/confirm-totes')

  const handleCancelHint = () => setIsShowHint(false)

  const handleHintClick = () => {
    if (hintObj && hintObj.link) {
      browserHistory.push(hintObj.link)
    } else {
      handleCancelHint()
    }
  }

  const gotoOpenFreeServicer = () => {
    browserHistory.push({ pathname: '/open_free_service', state: 'new_totes' })
  }

  const hideAlert = () => setShowAlert(false)

  const handleFreeService = () => {
    const { tote_cart } = props
    if (tote_cart.disable_free_service) {
      dispatch(
        ApplyFreeServiceToToteCart(dispatch => {
          dispatch(
            Actions.tips.changeTips({ isShow: true, content: '已启用自在选' })
          )
          queryToteCartData()
        })
      )
    } else {
      const { clothing_items, max_clothing_count } = tote_cart
      if (max_clothing_count - clothing_items.length < 2) {
        handleShowFreeService()
      } else {
        removeFreeServiceFromToteCart()
      }
    }
  }

  const handleShowFreeService = () => setShowFreeServiceTips(true)

  const handleHideFreeService = () => setShowFreeServiceTips(false)

  const handleHintToteTooFastHint = () => setShowToteTooFastHint(false)

  const handleToteTooFastHint = () => {
    dispatch(Actions.toteCart.queryToteCart(queryToteCartSuccess))
  }

  const removeFreeServiceFromToteCart = () => {
    dispatch(
      RemoveFreeServiceFromToteCart(dispatch => {
        dispatch(
          Actions.tips.changeTips({ isShow: true, content: '已临时关闭自在选' })
        )
        queryToteCartData()
      })
    )
    handleHideFreeService()
  }

  const guideType = () => {
    let guideType = null
    if (toteCartGuide) {
      guideType = tote_cart.display_more_product_entry
        ? tote_cart.onboarding
          ? 'onboarding'
          : 'default'
        : 'oldUser'
    }
    return guideType
  }

  if (_.isEmpty(tote_cart) || _.isEmpty(tote_cart.state)) return null
  const {
    accessory_items,
    clothing_items,
    max_clothing_count,
    max_accessory_count,
    with_free_service,
    display_free_service_banner,
    display_more_product_entry,
    customer_coupon_id,
    popup,
    disable_free_service,
    used_free_service
  } = tote_cart
  return (
    <div className="new-totes-container">
      {display_free_service_banner && !with_free_service && !isJdEnv && (
        <OpenEntryBanner dispatch={dispatch} />
      )}
      {with_free_service && (
        <CartFreeServiceTitle
          disable_free_service={disable_free_service}
          handleFreeService={handleFreeService}
          used_free_service={used_free_service}
          isShowTotesCartGuide={isShowGuide}
        />
      )}
      <CartProducts
        title="衣服"
        isShowPromo={true}
        dispatch={dispatch}
        filter_terms="clothing"
        products={clothing_items}
        maxNum={max_clothing_count}
        withFreeService={with_free_service}
        coupons={props.customer.valid_coupons}
        usedCoupons={customer_coupon_id && [customer_coupon_id]}
        placeholderImg={require('src/app/containers/totes/new_totes/cart_products/images/clothing.svg')}
      />
      <CartProducts
        placeholderImg={require('src/app/containers/totes/new_totes/cart_products/images/accessory.svg')}
        title="配饰"
        maxNum={max_accessory_count}
        products={accessory_items}
        dispatch={dispatch}
        filter_terms="accessory"
      />
      <span onClick={handleGotoCollections} className="swap-product-icon" />
      {display_more_product_entry && (
        <div className="select-more-product" onClick={gotoHome}>
          去挑选更多服饰
        </div>
      )}
      {isShowGuide && (
        <CartProductsGuide type={guideType()} handleFinish={handelHideGuide} />
      )}
      {isShowErrorText && (
        <div className="unvalid-tips">
          <img
            alt=""
            className="unvalid-icon"
            src={require('src/app/containers/totes/new_totes/images/unvalid-tips.svg')}
          />
          {errorText}
        </div>
      )}
      <StickyButtonContainer isSingle={true}>
        <ActionButton disabled={false} onClick={lockTote} size="stretch">
          下单衣箱
        </ActionButton>
      </StickyButtonContainer>
      {isShowHint && (
        <Hint
          isCenter
          title={hintObj.title}
          content={hintObj.content}
          leftBtnText={hintObj.hasCancel ? null : '取消'}
          leftButton={handleCancelHint}
          rightBtnText={hintObj.buttonText}
          rightButton={handleHintClick}
        />
      )}
      {showFreeServiceTips && (
        <Hint
          isCenter
          content="本衣箱不开启自在选，将删除最后2个衣位"
          setAllButtonsRed={true}
          leftBtnText="取消"
          rightBtnText="确认"
          leftButton={handleHideFreeService}
          rightButton={removeFreeServiceFromToteCart}
        />
      )}
      {isShowToteTooFastHint && (
        <Hint
          isCenter
          children={toteTooFastHint}
          leftBtnText="取消"
          rightBtnText="确认"
          leftButton={handleHintToteTooFastHint}
          rightButton={handleToteTooFastHint}
        />
      )}
      {showAlert && (
        <Alert
          title={alertTitle}
          btnText="好的"
          content={alertContent}
          handleClick={hideAlert}
        />
      )}
      {showPopup && (
        <Popup popup={popup} close={closePopup} next={gotoOpenFreeServicer} />
      )}
    </div>
  )
}
