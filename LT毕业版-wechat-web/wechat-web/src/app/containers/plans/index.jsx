import { connect } from 'react-redux'
import { lazy } from 'react'
import Actions from 'src/app/actions/actions'
import wxInit from 'src/app/lib/wx_config.js'
import Authentication from 'src/app/lib/authentication'
import PersonalAuthenticationHOC from 'src/app/components/HOC/PersonalAuthentication'
import plansIntroHOC from 'src/app/components/HOC/plansIntro'
import PublicClass from './public_class'
import { browserHistory, withRouter } from 'react-router'
import classnames from 'classnames'
import { compose, branch, renderNothing } from 'recompose'
import * as storage from 'src/app/lib/storage.js'
import PageHelmet from 'src/app/lib/pagehelmet'
import PayBottom from './pay_bottom'
import Agreement from './agreement'
import SubscriptionListV2 from './subscription_list/subscription_list_v2'
import SwpiperCard from './swiper_card'
import OldVersionPlans from './old_version'
import AutoRenewDiscount from 'src/app/containers/plans/auto_renew_discount'
import './index.scss'
import { MIGRATION_JSON_PATH } from '../../constants/global_config'

const PlansCancelQuestion = lazy(() =>
  import('src/app/containers/questionnaire/plans_cancel')
)

export const getState = state => {
  const {
    subscriptionTypes,
    customer,
    promoCode,
    app,
    operation,
    plans: {
      newCombo,
      cancelQuestionarie,
      subscription_type_ids,
      inPlans,
      default_select_subscription_type_id
    }
  } = state
  const authentication = Authentication(customer)
  // NOTE: 筛选会员购买券
  customer['valid_promo_codes'] =
    customer.valid_promo_codes &&
    customer.valid_promo_codes.filter(item => item.type === 'MemberPromoCode')
  return {
    customer,
    data: newCombo.seletedSubType,
    authentication,
    promoCode,
    app,
    operation_plan: operation.operation_plan,
    subscriptionData: subscriptionTypes.subscription_groups || [],
    cancelQuestionarie,
    newCombo,
    subscription_type_ids,
    inPlans,
    default_select_subscription_type_id
  }
}

const enhance = compose(
  connect(getState),
  withRouter,
  plansIntroHOC,
  PersonalAuthenticationHOC,
  branch(props => _.isEmpty(props.customer.id), renderNothing)
)

export class Plans extends PublicClass {
  constructor(props) {
    super(props)
    this.state = {
      questionAlert: false,
      isSetDefaultCartByIds: _.isEmpty(props.subscription_type_ids)
    }
    this.authentication = props.authentication
    // NOTE:订单创建时间
    this.creatOrderTime = null
    // NOTE:百度统计会员类型
    this.analyzeUserType = this.authentication.isSubscriber ? 'extend' : 'join'
    // NOTE:UTM数据，如果有全部统计都需要带上
    const {
      utm_source,
      utm_medium,
      utm_campaign,
      QRCode
    } = props.location.query
    this.utm_data = {
      source: utm_source,
      medium: utm_medium,
      campaign: utm_campaign
    }
    // NOTE:H5支付成功的回调界面
    this.renderH5Success = `/h5_plans_success?userType=${
      this.authentication.isSubscriber ? 'renewMember' : 'openMember'
    }${_.isEmpty(QRCode) ? '' : `&QRCode=${QRCode}`}`
    // NOTE: pulic class will use
    this.promo_plans = false
  }

  componentWillMount = () => {
    const { authentication, dispatch, router, route } = this.props
    if (!authentication.isSubscriber) {
      dispatch(
        Actions.plans.getCancelQuestionarie(
          '/hps/questionnaire/web/cancel_plans.json'
        )
      )
      dispatch(
        Actions.plans.getLeaveQuestionarie(
          '/hps/questionnaire/app/quit_plans.json'
        )
      )
      router.setRouteLeaveHook(route, nextLocation => {
        if (nextLocation.action === 'POP' && !storage.get('isShowedAlert')) {
          dispatch(Actions.app.showGlobalQuestionaire())
          dispatch(Actions.app.resetQuizShowTime())
        }
        return true
      })
    }
    window.adhoc('getFlags', flag => {
      flag.get('D181214_WECHAT_PLAYING_TOTE')
      flag.get('D181220_WECHAT_TOTE_INTRODUCE')
      flag.get('D181219_WECHAT_REFERRAL_BANNER')
      if (flag.get('D190102_WECHAT_CANCEL_PAY_TEXT') === 2) {
        this.abTestCancelText = '你与众多美衣仅一步之遥'
        this.forceUpdate()
      }
      window.adhoc('track', 'enterPaymentPage', 1)
    })
  }

  componentDidMount() {
    wxInit()
    const {
      app: { isWechat },
      data,
      authentication: { isSubscriber },
      customer: { finished_onboarding_questions },
      subscriptionData,
      subscription_type_ids,
      inPlans,
      dispatch
    } = this.props
    if (_.isEmpty(subscriptionData)) {
      this.extendableSubscriptionTypes()
    } else {
      if (inPlans) {
        this.setState({ isSetDefaultCartByIds: true })
      } else {
        this.setDefaultCartByIds(subscriptionData, subscription_type_ids)
      }
      dispatch(Actions.plans.setInPlans(false))
      setTimeout(() => {
        const {
          newCombo: { seletedSubType }
        } = this.props
        this.handleSelectSub(seletedSubType, true)()
      }, 200)
    }

    if (finished_onboarding_questions === 'ALL')
      window.adhoc('track', 'onboarding_15', 1)
    if (isWechat && !_.isEmpty(data)) {
      this.analyzePlansEnter(this.props)
      if (this.trackAbtest) {
        window.adhoc('getFlags', flag => {
          // NOTE：需要先Get
          flag.get('D181212_WECHAT_NEW_ALL_ALL_ALL_1')
          this.trackAbtest('visit_member', () => {
            this.isTrackMember = true
          })
        })
      }
    }

    if (!isSubscriber) {
      window.adhoc('getFlags', flag => {
        flag.get('D181128_WECHAT_NEW_499_ALL')
        flag.get('D181128_WECHAT_NEW_499_ALL_V2')
        flag.get('D181128_WECHAT_NEW_ALL_ALL')
        flag.get('D190902_NON_MEMBER_BANNER')
      })
    }

    const { subscription_fees_count, subscription } = this.props.customer
    if (
      this.authentication.isValidSubscriber &&
      subscription_fees_count === 1 &&
      subscription.subscription_type.id === '18'
    ) {
      this._getExtendSuccessQuiz()
    }
  }

  _getExtendSuccessQuiz = () => {
    const { dispatch } = this.props
    const input = { slug: 'QUIZSubscribeSuccess' }
    dispatch(
      Actions.floatHover.getQuiz(input, (dis, response) => {
        this.extendSuccessQuiz = response.data.quiz
      })
    )
  }

  componentDidUpdate(prevProps) {
    const { isWechat } = this.props.app
    if (isWechat && _.isEmpty(prevProps.data) && !_.isEmpty(this.props.data)) {
      this.analyzePlansEnter(this.props)
      if (!this.isTrackMember && this.trackAbtest) {
        window.adhoc('getFlags', () => {
          // NOTE：需要先Get
          this.trackAbtest('visit_member')
        })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    //NOTE: when user have available promo code, default use first promo code
    const { data, promoCode } = nextProps
    if (
      !_.isEmpty(data) &&
      !_.isEmpty(data.available_promo_codes) &&
      promoCode.codeState === 'collapsed'
    ) {
      this.initMaxPromoCode(nextProps)
    }
  }

  setDefaultCartByIds = (subscriptionData, subscription_type_ids) => {
    const { default_select_subscription_type_id, dispatch } = this.props
    const { cardType, subType } = this.getFocusGroups(
      subscriptionData,
      subscription_type_ids
        ? subscription_type_ids
        : [default_select_subscription_type_id]
    )
    this.setState({ isSetDefaultCartByIds: true })
    if (cardType) {
      dispatch(Actions.plans.setCardType(cardType, true))
      dispatch(Actions.plans.setSubType(subType, true))
    }
  }

  isShowQuestionAlert = () => {
    return !this.authentication.isSubscriber && !this.state.questionAlert
  }

  showQuestionAlert = () => {
    this.setState({
      questionAlert: true
    })
    storage.set('isShowedAlert', true)
  }

  closeQuestionAlert = () => {
    this.setState({ questionAlert: false })
  }

  extendableSubscriptionTypes = () =>
    this.props.dispatch(
      Actions.subscriptionTypes.getExtendableSubscriptionTypes(
        this.extendableSuccess
      )
    )
  extendableSuccess = (dispatch, res) => {
    const { needs_migration } = res.data.extendable_subscription_types
    if (needs_migration) {
      window.location.replace(MIGRATION_JSON_PATH)
      return null
    }
    const { subscription_type_ids, subscriptionData } = this.props
    this.setDefaultCartByIds(subscriptionData, subscription_type_ids)
    const { seletedSubType } = this.props.newCombo
    if (!seletedSubType) {
      return
    }
    const code = this.checkPromoCode(seletedSubType, true)
    if (code) {
      this.fetchPreviewSubscriptionType(seletedSubType.id, code)
    } else {
      this.fetchPreviewSubscriptionType(seletedSubType.id)
    }
  }
  fetchPreviewSubscriptionType = (id, promo_code) => {
    const { dispatch } = this.props
    if (promo_code) {
      dispatch(
        Actions.subscriptionTypes.fetchPreviewSubscriptionType(id, promo_code)
      )
    } else {
      dispatch(Actions.subscriptionTypes.fetchPreviewSubscriptionType(id))
    }
  }

  componentWillUnmount() {
    //every time enter activity page
    storage.remove('clickButton')
    storage.remove('isShowedAlert')
    const { inPlans } = this.props
    if (!inPlans) {
      //退出支付页重置 ids 和 当前选择的优惠券
      this.props.dispatch(Actions.plans.changeSubType(null))
      this.props.dispatch(Actions.plans.resetSubIds())
      this.props.dispatch(Actions.promoCode.reset())
    }
  }

  matchAbtestCondition = () => {
    const { data, authentication } = this.props
    return !authentication.isSubscriber && !_.isEmpty(data)
  }

  // NOTE:ABTest上报月卡会员(除79、度假等)
  trackAbtest = (eventType, callback) => {
    if (!this.matchAbtestCondition()) return null
    try {
      window.adhoc('track', eventType, 1)
      callback && callback()
    } catch (error) {}
  }

  // NOTE:ABTest上报第一次购买全部会员
  trackAllSub = (eventType, callback) => {
    const { data, authentication } = this.props
    const matchTest =
      !authentication.isSubscriber && !this.referralCode && !_.isEmpty(data)
    if (!matchTest) return null
    try {
      window.adhoc('track', eventType, 1)
      callback && callback()
    } catch (error) {}
  }

  _pushToExtendSuccessQuiz = () => {
    const data = {
      pathname: `/quiz_page`,
      query: {
        quizUrl: this.extendSuccessQuiz.url,
        slug: 'QUIZSubscribeSuccess'
      }
    }
    browserHistory.replace(data)
  }

  linkToPlansSuccess = () => {
    if (this.extendSuccessQuiz) {
      this._pushToExtendSuccessQuiz()
      return
    }
    const { location, dispatch } = this.props
    dispatch(Actions.currentCustomer.fetchMe())

    if (location.query.jdExchange) {
      browserHistory.replace('/jd_exchange_mid_page')
      return null
    }

    browserHistory.replace({
      pathname: '/plans_success',
      query: {
        ...location.query,
        payType: this.authentication.isSubscriber ? 'renewMember' : 'openMember'
      }
    })
  }

  getFocusGroups = (subscriptionGroups, ids) => {
    let cardType, subType
    subscriptionGroups.forEach(item => {
      item.subscription_types.forEach(type => {
        if (_.includes(ids, Number(type.id))) {
          if (!cardType && !subType) {
            cardType = item
            subType = type
          }
        }
      })
    })
    if (!cardType && subscriptionGroups) {
      cardType = subscriptionGroups[0]
      subType = cardType && cardType.subscription_types[0]
    }
    return { cardType, subType }
  }

  gotoAgreement = async () => {
    await this.props.dispatch(Actions.plans.setInPlans(true))
    browserHistory.push('/agreement')
  }

  handleGoPromoCode = async () => {
    const { data, dispatch } = this.props
    if (!_.isEmpty(data.available_promo_codes)) {
      await dispatch(Actions.plans.setInPlans(true))
      browserHistory.push('/plans_promo_code')
    }
  }

  handleSelectSub = (sub, usePrompCode) => () => {
    const { dispatch } = this.props
    dispatch(Actions.plans.setSubType(sub))
    let code = this.checkPromoCode(sub, usePrompCode)
    if (code) {
      this.fetchPreviewSubscriptionType(sub.id, code)
    } else {
      this.fetchPreviewSubscriptionType(sub.id)
    }
  }

  checkPromoCode = (data, usePrompCode) => {
    const { available_promo_codes, id } = data
    const {
      dispatch,
      promoCode: { valid_promo_codes, codeState, code }
    } = this.props

    const a = valid_promo_codes && valid_promo_codes.find(i => i.code === code)
    let bool = false
    if (a) {
      bool = _.find(a.subscription_type_ids, i => Number(i) === Number(id))
    }
    let currentCode
    if (bool && code && codeState === 'valid' && usePrompCode) {
      currentCode = code
    } else {
      if (!_.isEmpty(available_promo_codes)) {
        const maxValidPromoCode = this.sortMaxPromoCode(available_promo_codes)
        currentCode = maxValidPromoCode.code

        dispatch(Actions.promoCode.set(maxValidPromoCode))
      }
    }
    return currentCode
  }

  selectCardType = selectedCard => {
    const { dispatch } = this.props
    const available_promo_codes =
      selectedCard.subscription_types[0].available_promo_codes
    if (!_.isEmpty(available_promo_codes)) {
      const maxValidPromoCode = this.sortMaxPromoCode(available_promo_codes)
      dispatch(Actions.promoCode.set(maxValidPromoCode))
      this.fetchPreviewSubscriptionType(
        selectedCard.subscription_types[0].id,
        maxValidPromoCode.code
      )
    } else {
      this.fetchPreviewSubscriptionType(selectedCard.subscription_types[0].id)
    }
    this.setCardType(selectedCard)
  }

  setCardType = selectedCard =>
    this.props.dispatch(Actions.plans.setCardType(selectedCard))

  render() {
    if (!this.props.data || !this.state.isSetDefaultCartByIds) return null
    const {
        data,
        cancelQuestionarie,
        customer: { valid_promo_codes, available_purchase_credit },
        promoCode: { discountAmount, codeState },
        app: { hasButtonActivated, platform, isWechat },
        subscriptionData,
        newCombo: { seletedCardType, seletedSubType, nowPrice }
      } = this.props,
      amount = available_purchase_credit ? available_purchase_credit.amount : 0,
      { preview, available_promo_codes } = data,
      expiration_date = preview && preview.expiration_date,
      cash_price = preview && preview.cash_price,
      valid_promo_code = !!valid_promo_codes && valid_promo_codes.length,
      classname = classnames({
        'vip-promo-code': valid_promo_code !== 0,
        'not-has-promo-code': valid_promo_code === 0
      })
    const activeSlide = _.findIndex(
      subscriptionData,
      ps => ps.title === seletedCardType.title
    )
    if (subscriptionData.length === 1)
      return (
        <OldVersionPlans
          data={data}
          subscriptionData={subscriptionData}
          authentication={this.authentication}
          platform={platform}
          customer={this.props.customer}
          amount={amount}
          cash_price={cash_price}
          valid_promo_code={valid_promo_code}
          valid_promo_codes={valid_promo_codes}
          classname={classname}
          available_promo_codes={available_promo_codes}
          codeState={codeState}
          discountAmount={discountAmount}
          needPrice={nowPrice}
          expiration_date={expiration_date}
          hasButtonActivated={hasButtonActivated}
          cancelQuestionarie={cancelQuestionarie}
          isWechat={isWechat}
          handleSelectSub={this.handleSelectSub}
          handleGoPromoCode={this.handleGoPromoCode}
          gotoAgreement={this.gotoAgreement}
          showPaymentTipsText={this.showPaymentTipsText}
          handlePayment={this.handlePayment}
          questionAlert={this.state.questionAlert}
          abTestCancelText={this.abTestCancelText}
          closeQuestionAlert={this.closeQuestionAlert}
        />
      )
    return (
      <div className="plans">
        <PageHelmet title={`会员支付`} link={`/plans`} />
        <SwpiperCard
          subscription_groups={subscriptionData}
          selectCardType={this.selectCardType}
          activeSlide={activeSlide}
        />
        <div className="subscriptions">
          {!!seletedSubType.operation_plan &&
            seletedSubType.operation_plan.image_url && (
              <img
                src={seletedSubType.operation_plan.image_url}
                alt="operation-plan"
                className="operation-plan"
              />
            )}
          <SubscriptionListV2
            subscription={seletedCardType.subscription_types}
            authentication={this.authentication}
            selectSub={data}
            handleSelectSub={this.handleSelectSub}
          />
        </div>
        {platform === 'jd' && (
          <div className="jd-credit">
            <div>小白信用免押金</div>
            <div className="referral-amount">&yen;0</div>
          </div>
        )}
        <AutoRenewDiscount platform={platform} data={data} isNewPlans />
        {!!valid_promo_code && valid_promo_codes.length !== 0 && (
          <span
            className={classnames('vip', {
              bg: subscriptionData.length !== 1
            })}
            onClick={this.handleGoPromoCode}
          >
            <div>优惠券</div>
            <div className={classname}>
              {!_.isEmpty(available_promo_codes) &&
              _.isArray(available_promo_codes) ? (
                codeState === 'valid' ? (
                  <span style={{ fontSize: '14px' }}>
                    -&yen;{discountAmount}
                  </span>
                ) : (
                  `${available_promo_codes.length}张可用`
                )
              ) : (
                '暂无可用'
              )}
              <i />
            </div>
          </span>
        )}
        {!!amount && (
          <div className="referral-code">
            奖励金
            <span className="referral-amount">
              奖励金共<span>¥{amount}</span>，本次可使用
              <span>&yen;{cash_price}</span>
            </span>
          </div>
        )}
        {platform === 'jd' && (
          <div className="jd-credit border-buttom">
            <div>支付方式</div>
            <div className="jd-payment-icon" />
          </div>
        )}
        <Agreement gotoAgreement={this.gotoAgreement} />
        <PayBottom
          needPrice={nowPrice}
          expirationDate={this.showPaymentTipsText(
            this.authentication.isSubscriber,
            expiration_date
          )}
          hasButtonActivated={hasButtonActivated}
          activePayment={this.handlePayment}
        />
        {this.state.questionAlert && (
          <PlansCancelQuestion
            title={this.abTestCancelText || '支付遇到困难？'}
            queryData={cancelQuestionarie}
            handleCancel={this.closeQuestionAlert}
            activePayment={this.handlePayment}
          />
        )}
      </div>
    )
  }
}

export default enhance(Plans)
