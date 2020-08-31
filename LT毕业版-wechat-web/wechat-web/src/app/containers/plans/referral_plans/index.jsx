import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'
import wxInit from 'src/app/lib/wx_config.js'
import PageHelmet from 'src/app/lib/pagehelmet'
import PersonalAuthenticationHOC from 'src/app/components/HOC/PersonalAuthentication'
import plansIntroHOC from 'src/app/components/HOC/plansIntro'
import Authentication from 'src/app/lib/authentication'
import PublicClass from '../public_class'
import PayBottom from '../pay_bottom'
import Agreement from '../agreement'
import { browserHistory } from 'react-router'
import { format } from 'date-fns'
import SubscriptionList from '../subscription_list'
import { compose, branch, renderNothing } from 'recompose'
import * as CARD_TYPE from 'src/app/lib/card_type.js'
import * as storage from 'src/app/lib/storage.js'
import 'src/app/containers/plans/old_version/old_version.scss'

export const getState = (state, ownProps) => {
  const {
      subscriptionTypes,
      customer,
      promoCode,
      app,
      operation,
      plans: { selectSubType }
    } = state,
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
    subscriptionData =
      customer.subscription_type || customer.subscription.subscription_type
  } else {
    const filterData = _.filter(
      subscriptionTypes,
      subscription => subscription.is_signupable === true
    )
    subscriptionData = filterData[0]
  }
  //NOTE: if you has not a annual card membership, then select annual_subscription_type annual card. if you has annual card membership, annual_subscription_type === null
  let sub_data = null
  const subType = selectSubType || sub_type || next_page
  if (subscriptionData) {
    if (subType === 'annual_card') {
      sub_data = subscriptionData.annual_subscription_type
    } else if (subType === 'quarterly_card') {
      sub_data = subscriptionData.quarterly_subscription_type
    } else {
      sub_data = subscriptionData.monthly_subscription_type
      if (authentication.isValidSubscriber) {
        const { interval } = customer.subscription.subscription_type
        if (interval === CARD_TYPE.ANNUAL_CARD_TYPE) {
          sub_data = subscriptionData.annual_subscription_type
        }
        if (interval === CARD_TYPE.SEASON_CARD) {
          sub_data = subscriptionData.quarterly_subscription_type
        }
      }
    }
  }
  // NOTE: 筛选会员购买券
  customer['valid_promo_codes'] =
    customer.valid_promo_codes &&
    customer.valid_promo_codes.filter(item => item.type === 'MemberPromoCode')
  return {
    customer,
    data: sub_data,
    authentication,
    promoCode,
    app,
    operation_plan: operation.operation_plan,
    isAnnualCardAcivity,
    subscriptionData
  }
}

const enhance = compose(
  connect(getState),
  plansIntroHOC,
  PersonalAuthenticationHOC,
  branch(props => _.isEmpty(props.customer.id), renderNothing)
)

export class ReferralPlans extends PublicClass {
  constructor(props) {
    super(props)
    this.authentication = props.authentication
    this.referralCode = storage.get('REFERRAL_CODE')
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
    const {
      authentication: { isSubscriber, isExpiredSubscriber }
    } = this.props
    this.props.dispatch(Actions.promoCode.getMemberPromoCode())
    if (!isSubscriber || isExpiredSubscriber) {
      this.fetchPlans()
    }
    // NOTE: 拿用了promo code的最新preview
    this.fetchNewST()
    window.adhoc('getFlags', flag => {
      flag.get('D181204_WECHAT_REFERRAL_IMG')
    })
  }

  componentDidMount() {
    wxInit()
    const { data, app } = this.props
    if (app.isWechat && !_.isEmpty(data)) {
      this.analyzePlansEnter(this.props)
    }
  }

  componentWillReceiveProps(nextProps) {
    //NOTE: when user have available promo code, default use first promo code
    if (!this.props.data && nextProps.data) {
      // NOTE:神策数据上报
      this.analyzePlansEnter(nextProps)
    }
    if (!_.isEqual(this.props.promoCode, nextProps.promoCode)) {
      if (
        !nextProps.customer.hasNewestMe &&
        nextProps.promoCode.codeState === 'valid'
      )
        this.fetchNewST()
    }
  }

  componentDidUpdate(prevProps) {
    const { isWechat } = this.props.app
    if (isWechat && _.isEmpty(prevProps.data) && !_.isEmpty(this.props.data)) {
      this.analyzePlansEnter(this.props)
    }
  }

  trackAbtest = eventType => {
    try {
      window.adhoc('track', eventType, 1)
    } catch (error) {
      console.log(error)
    }
  }

  fetchNewST = () =>
    this.props.dispatch(
      Actions.subscriptionTypes.fetchNewestSubscriptionTypes(
        this.initValidPromoCode()
      )
    )

  componentWillUnmount() {
    //every time enter activity page
    storage.remove('clickButton')
    // NOTE: reset promo abtest state
    this.props.dispatch(Actions.app.abtestGiftRecieveState('reset'))
  }

  trackNewMember = () => {
    try {
      window.adhoc('track', 'subscribe_member', 1)
    } catch (error) {
      console.log(error)
    }
  }

  linkToPlansSuccess = () => {
    this.props.dispatch(Actions.currentCustomer.fetchMe())
    const query = {
      payType: this.authentication.isSubscriber ? 'renewMember' : 'openMember'
    }
    if (this.referralCode) {
      query['isReferral'] = true
    }
    browserHistory.replace({
      pathname: '/plans_success',
      query
    })
  }

  gotoAgreement = () => browserHistory.push('/agreement')

  optimizePrice = (original, discounts) =>
    original - discounts > 0 ? (original - discounts).toFixed(2) : 0

  handleSelectSub = async sub => {
    const { authentication, dispatch } = this.props
    const type = this.getSelectSubType(sub) || 'monthly_card'
    await dispatch(Actions.plans.changeSubType(type))
    this.fetchNewST()
    if (!authentication.isValidSubscriber) {
      this.fetchPlans()
    }
  }

  getSelectSubType = sub => {
    if (_.isEmpty(sub)) {
      return null
    }
    const type = CARD_TYPE.getCardType(sub.interval)
    if (type === '年') {
      return 'annual_card'
    } else if (type === '季') {
      return 'quarterly_card'
    } else {
      return null
    }
  }

  render() {
    if (!this.props.data) return null
    const {
        data,
        customer,
        customer: {
          available_purchase_credit,
          subscription,
          active_referral_program: { sender_amount }
        },
        app: { hasButtonActivated, abtestGiftRecieveState, platform, isWechat },
        subscriptionData
      } = this.props,
      amount = available_purchase_credit ? available_purchase_credit.amount : 0,
      { preview } = data
    const needPrice = parseFloat(
      this.optimizePrice(data.base_price, sender_amount),
      10
    )
    const expirationDate = format(
      new Date(preview && preview.expiration_date),
      '有效期至YYYY年MM月DD日'
    )
    return (
      <div className="plans">
        <PageHelmet title={`会员支付`} link="/referral_plans" />
        <div className="mid">
          <div
            className="card"
            style={{
              backgroundImage: `url(${
                data.operation_plan
                  ? data.operation_plan.banner_url
                  : data.banner_url
              })`
            }}
          >
            {abtestGiftRecieveState === true && (
              <div>
                <div className="couple-gift-logo" />
                <div className="pre-price">原价¥499/月</div>
              </div>
            )}
            <p className="bg-card-title">
              {`${data.display_name}${CARD_TYPE.getCardType(data.interval)}`}卡
            </p>
          </div>
          <SubscriptionList
            customer={customer}
            isReferral={true}
            subscription={
              this.authentication.isValidSubscriber
                ? subscription
                : { subscription_type: subscriptionData }
            }
            authentication={this.props.authentication}
            selectSub={data}
            isWechat={isWechat}
            isHideAnnualCard={true}
            handleSelectSub={this.handleSelectSub}
          />
          {platform === 'jd' && (
            <div className="jd-credit">
              <div>小白信用免押金</div>
              <div className="referral-amount">&yen;0</div>
            </div>
          )}
          {!!(this.referralCode || amount) && (
            <div className="referral-code">
              接受邀请的优惠
              <span className="referral-save">-&yen;{sender_amount}</span>
            </div>
          )}
          {platform === 'jd' && (
            <div className="jd-credit border-buttom">
              <div>支付方式</div>
              <div className="jd-payment-icon" />
            </div>
          )}
          <Agreement gotoAgreement={this.gotoAgreement} />
        </div>
        <PayBottom
          needPrice={needPrice}
          expirationDate={expirationDate}
          hasButtonActivated={hasButtonActivated}
          activePayment={this.handlePayment}
        />
      </div>
    )
  }
}

export default enhance(ReferralPlans)
