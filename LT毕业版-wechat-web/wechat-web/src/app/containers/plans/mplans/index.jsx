import { compose, branch, renderNothing } from 'recompose'
import enhanceHOC from 'src/app/components/HOC/recompose_enhance/index.jsx'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import PublicClass from '../public_class'
import Agreement from '../agreement'
import PersonalAuthenticationHOC from 'src/app/components/HOC/PersonalAuthentication'
import plansIntroHOC from 'src/app/components/HOC/plansIntro'
import PayBottom from '../pay_bottom'
import wxInit from 'src/app/lib/wx_config.js'
import Authentication from 'src/app/lib/authentication'
import Actions from 'src/app/actions/actions'
import * as storage from 'src/app/lib/storage.js'
import './index.scss'
import {
  APPStatisticManager,
  BaiduStatisService
} from '../../../lib/statistics/app'

const getState = state => {
  const { subscriptionTypes, app, customer, promoCode } = state
  return {
    subscriptionTypes,
    app,
    customer,
    promoCode,
    authentication: Authentication(customer),
    data: customer.vacation_card
  }
}

const enhance = compose(
  connect(getState),
  plansIntroHOC,
  PersonalAuthenticationHOC,
  enhanceHOC(props => _.isEmpty(props.subscriptionTypes), {
    componentWillMount() {
      this.props.dispatch(Actions.subscriptionTypes.fetchBeachVacationTypes())
    }
  }),
  branch(props => _.isEmpty(props.customer.id), renderNothing)
)

@enhance
export default class MPlans extends PublicClass {
  constructor(props) {
    super(props)
    this.authentication = props.authentication
    // NOTE:H5支付成功的回调界面
    this.renderH5Success = `/h5_plans_success?userType=${
      this.authentication.isSubscriber ? 'renewMember' : 'openMember'
    }`
    // NOTE:订单创建时间
    this.creatOrderTime = null
    // NOTE:百度统计会员类型
    this.analyzeUserType = props.authentication.isSubscriber ? 'extend' : 'join'
    // NOTE:UTM数据，如果有全部统计都需要带上
    const { utm_source, utm_medium, utm_campaign } = this.props.location.query
    this.utm_data = {
      source: utm_source,
      medium: utm_medium,
      campaign: utm_campaign
    }

    // NOTE: pulic class will use
    this.promo_plans = false
  }

  componentWillMount() {
    wxInit()
    APPStatisticManager.service(BaiduStatisService.id).track(
      this.analyzeUserType,
      this.utm_data,
      'intent'
    )
  }

  componentDidMount() {
    // NOTE: fix h5 payment cancel
    storage.set('pay_way', 'mplans')
  }

  gotoAgreement = () => browserHistory.push('/agreement')

  handleSelectPackage = id => () => {
    this.props.dispatch(Actions.subscriptionTypes.setSelectedCard(id))
  }

  linkToPlansSuccess = () => {
    // NOTE：度假套餐返回需要进行清除
    this.props.dispatch(Actions.currentCustomer.fetchMe())
    storage.get('vacation_plans') && storage.remove('vacation_plans')
    browserHistory.replace({
      pathname: '/plans_success',
      query: {
        payType: this.authentication.isSubscriber ? 'renewMember' : 'openMember'
      }
    })
  }

  render() {
    const {
      app: { hasButtonActivated, platform },
      data,
      data: {
        preview: { final_price },
        id,
        days_interval
      },
      customer: { available_purchase_credit },
      subscriptionTypes
    } = this.props
    const cash_price = data.preview && data.preview.cash_price,
      amount = available_purchase_credit ? available_purchase_credit.amount : 0
    return (
      <div className="mplans">
        <PageHelmet title="购买套餐" link={'/mplans'} />
        {subscriptionTypes.map((item, index) => (
          <CardType
            key={index}
            id={item.id}
            sub_display_name={item.sub_display_name}
            accessory_count={item.accessory_count}
            clothing_count={item.clothing_count}
            original_price={item.original_price}
            name={item.operation_plan && item.operation_plan.name}
            selectPackage={this.handleSelectPackage}
            activedId={id}
          />
        ))}
        {platform === 'jd' && (
          <div className="jd-credit">
            <div className="title">小白信用免押金</div>
            <div className="referral-amount">&yen;0</div>
          </div>
        )}
        {!!amount && (
          <div className="referral-code">
            <span className="title">奖励金</span>
            <span className="referral-amount">
              奖励金共<span>¥{amount}</span>，本次可使用
              <span>&yen;{cash_price}</span>
            </span>
          </div>
        )}
        <div className="mplans-agreement">
          <Agreement
            gotoAgreement={this.gotoAgreement}
            className="mplans-agree"
          />
        </div>
        <PayBottom
          needPrice={final_price}
          expirationDate={`有效期${days_interval}天`}
          hasButtonActivated={hasButtonActivated}
          activePayment={this.handlePayment}
        />
      </div>
    )
  }
}

export const CardType = ({
  sub_display_name,
  accessory_count,
  clothing_count,
  original_price,
  name,
  id,
  activedId,
  selectPackage
}) => (
  <div
    className={classnames('card-type', 'mid', {
      activedCard: id === activedId
    })}
    onClick={selectPackage(id)}
  >
    <div className="vacation-type">{sub_display_name}</div>
    <div className="vacation-content">
      <span className="num">{clothing_count}</span>件衣服+
      <span className="num">{accessory_count}</span>件配饰
    </div>
    {!_.isEmpty(name) && <div className="send-code">{name}</div>}
    <div className="mplans-price">
      <span className="yen">&yen;</span>
      {original_price}
    </div>
  </div>
)
