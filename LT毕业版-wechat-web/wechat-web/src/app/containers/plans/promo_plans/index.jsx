import { connect } from 'react-redux'
import wxInit from 'src/app/lib/wx_config.js'
import PageHelmet from 'src/app/lib/pagehelmet'
import Authentication from 'src/app/lib/authentication'
import PersonalAuthenticationHOC from 'src/app/components/HOC/PersonalAuthentication'
import plansIntroHOC from 'src/app/components/HOC/plansIntro'
import UserBenefit from '../user_benefit'
import LetoteFreeTote from '../user_benefit/letote_free_tote_seventy_nine'
import { Membership } from 'src/app/containers/new_clothes_free'
import PublicClass from '../public_class'
import Agreement from '../agreement'
import { browserHistory } from 'react-router'
import { format } from 'date-fns'
import PayBottom from '../pay_bottom'
import { compose, branch, renderNothing } from 'recompose'
import * as CARD_TYPE from 'src/app/lib/card_type.js'
import * as storage from 'src/app/lib/storage.js'
import Actions from 'src/app/actions/actions'
import {
  PROMO_PLANS_CODE_LIST,
  MAIMAI_PROMO_CODE
} from 'src/app/lib/promo_code.js'
import 'src/app/containers/plans/old_version/old_version.scss'
import {
  APPStatisticManager,
  BaiduStatisService
} from '../../../lib/statistics/app'

const getState = (state, ownProps) => {
  const { subscriptionTypes, customer, promoCode, app, operation } = state,
    {
      location: {
        query: { next_page, sub_type }
      }
    } = ownProps
  const isAnnualCardAcivity = next_page === 'annual_card'
  const authentication = Authentication(customer)
  // FIXME:处于会员期的使用customer里面的信息继续续费，其他的都查询新的3+2套餐处理
  let subscriptionData = null
  if (authentication.isSubscriber && authentication.isValidSubscriber) {
    const { subscription_type } = customer.subscription
    subscriptionData = subscription_type
  } else {
    const filterData = _.filter(
      subscriptionTypes,
      subscription => subscription.is_signupable === true
    )
    subscriptionData = filterData[0]
  }
  //NOTE: if you has not a annual card membership, then select annual_subscription_type annual card. if you has annual card membership, annual_subscription_type === null
  let sub_data = null
  if (subscriptionData) {
    if (next_page === 'annual_card' || sub_type === 'annual_card') {
      sub_data = subscriptionData.annual_subscription_type
    } else if (sub_type === 'quarterly_card') {
      sub_data = subscriptionData.quarterly_subscription_type
    } else {
      sub_data = subscriptionData
    }
  }
  return {
    customer,
    data: sub_data,
    authentication,
    promoCode,
    app,
    operation_plan: operation.operation_plan,
    isAnnualCardAcivity
  }
}

const enhance = compose(
  connect(getState),
  plansIntroHOC,
  PersonalAuthenticationHOC,
  branch(props => _.isEmpty(props.customer.id), renderNothing)
)

@enhance
export default class Plans extends PublicClass {
  constructor(props) {
    super(props)
    this.authentication = this.props.authentication
    // NOTE:订单创建时间
    this.creatOrderTime = null
    // NOTE:百度统计会员类型
    this.analyzeUserType = this.authentication.isSubscriber ? 'extend' : 'join'
    // NOTE:UTM数据，如果有全部统计都需要带上
    const {
      utm_source,
      utm_medium,
      utm_campaign,
      promo_code,
      QRCode
    } = this.props.location.query
    this.utm_data = {
      source: utm_source,
      medium: utm_medium,
      campaign: utm_campaign
    }
    //NOTE: letote free tote ￥79
    this.letote_free_tote_79 =
      Boolean(storage.get('LETOTE_FREE_TOTE_79')) ||
      promo_code === 'LTCN_FREE_TOTE_79' ||
      promo_code === 'LTCN_FREE_TOTE'
    // NOTE:H5支付成功的回调界面
    this.renderH5Success = `/h5_plans_success?userType=${
      this.authentication.isSubscriber ? 'renewMember' : 'openMember'
    }${_.isEmpty(QRCode) ? '' : `&QRCode=${QRCode}`}`
    // NOTE: promo code plans
    this.promo_plans = true
  }

  componentWillMount = () => {
    const {
      authentication,
      location: { query }
    } = this.props
    if (!authentication.isSubscriber) this.fetchPlans()
    this.initRenderH5Success()
    const { isWechat } = this.props.app
    if (!isWechat && !_.isEmpty(query.promo_code)) {
      storage.set('promo_code', query.promo_code, localStorage)
    }
  }

  componentDidMount() {
    wxInit()
    APPStatisticManager.service(BaiduStatisService.id).track(
      this.analyzeUserType,
      this.utm_data,
      'intent'
    )
    if (this.letote_free_tote_79) {
      APPStatisticManager.service(BaiduStatisService.id).track(
        'trail_activity',
        {},
        'trail_activity_payment_page'
      )
    }
  }

  // NOTE:初始化H5的成功界面
  initRenderH5Success = () => {
    const { next_page } = this.props.location.query
    if (next_page === 'kol_activity') {
      this.renderH5Success = '/kol_success'
      if (this.letote_free_tote_79) {
        this.renderH5Success = '/kol_success?activity=seventy_nine'
      }
    }
  }

  componentWillUnmount() {
    //every time enter activity page
    storage.remove('clickButton')
  }

  linkToPlansSuccess = () => {
    this.props.dispatch(Actions.currentCustomer.fetchMe())
    this.letote_free_tote_79 && storage.remove('LETOTE_FREE_TOTE_79')
    browserHistory.replace({
      pathname: '/plans_success',
      query: {
        payType: this.authentication.isSubscriber ? 'renewMember' : 'openMember'
      }
    })
  }

  gotoAgreement = () => browserHistory.push('/agreement')

  render() {
    // NOTE: limit old membership
    if (this.props.authentication.isSubscriber) return <Membership />
    if (!this.props.data) return null
    const { next_page, sub_type, promo_code } = this.props.location.query,
      {
        data,
        customer: { available_purchase_credit },
        isAnnualCardAcivity,
        app: { hasButtonActivated }
      } = this.props,
      amount = available_purchase_credit ? available_purchase_credit.amount : 0,
      {
        display_name,
        days_interval,
        interval,
        preview,
        display_interval,
        original_price
      } = data,
      name = preview && preview.name,
      final_price = preview && preview.final_price,
      expiration_date = preview && preview.expiration_date,
      cash_price = preview && preview.cash_price,
      isMonthCard = interval === CARD_TYPE.ON_THE_CARD
    const expirationDate = this.letote_free_tote_79
      ? '有效期7天'
      : format(new Date(expiration_date), '有效期至YYYY年MM月DD日')
    const promoCode = promo_code || storage.get('promo_code')
    const showPrice = _.includes(PROMO_PLANS_CODE_LIST, promoCode)
      ? final_price
      : original_price
    return (
      <div className="plans">
        <PageHelmet title={`会员支付`} link={`/plans`} />
        {(isAnnualCardAcivity || this.letote_free_tote_79) && (
          <img
            src={
              isAnnualCardAcivity
                ? require('../images/banner.png')
                : require('../images/letote_free_tote_79.png')
            }
            alt="annual_card_banner"
            className={`annual-card-banner ${
              this.letote_free_tote_79 ? 'seventy-nite' : null
            }`}
          />
        )}
        <div className="mid">
          {!isAnnualCardAcivity && !this.letote_free_tote_79 ? (
            <div className="card">
              <span className="card-tips">
                {isMonthCard ? '托特衣箱' : display_name}
              </span>
              <p className="bg-card-title">{name}</p>
              <span className="card-bg-price">¥{showPrice}</span>
            </div>
          ) : null}
          {/* NOTE: 脉脉临时改动 */}
          {!this.letote_free_tote_79 &&
            promo_code !== MAIMAI_PROMO_CODE &&
            data.operation_plan &&
            data.operation_plan.image_url && (
              <img
                className="sub-activity"
                alt=""
                src={data.operation_plan.image_url}
              />
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

          <div className="vip-benefits">
            <div className="benefits-title">
              {isAnnualCardAcivity ? '年费套餐尊享' : name}权益
            </div>
            {!this.letote_free_tote_79 ? (
              <div className="benefits">
                <UserBenefit
                  isFastShipping={
                    this.props.customer.enable_payment_contract.length > 0
                  }
                  isPlansPage={true}
                  days_interval={days_interval}
                  display_interval={display_interval}
                  display_name={display_name}
                  interval={interval}
                  isAnnualCardAcivity={
                    isAnnualCardAcivity || sub_type === 'annual_card'
                  }
                  summer_plan={true}
                />
              </div>
            ) : (
              <LetoteFreeTote />
            )}
          </div>
          {isAnnualCardAcivity && (
            <div className="referral-code">
              年费套餐原价
              <span className="discount-amount">
                &yen;{data.base_price + 1000}
              </span>
            </div>
          )}
          <Agreement gotoAgreement={this.gotoAgreement} />
        </div>
        <PayBottom
          needPrice={final_price}
          expirationDate={expirationDate}
          hasButtonActivated={hasButtonActivated}
          activePayment={this.handlePayment}
          next_page={next_page}
        />
      </div>
    )
  }
}
