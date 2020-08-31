import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions'
import Loading from 'src/app/components/LoadingPage'
import PageHelmet from 'src/app/lib/pagehelmet'
import ActivityEnd from 'src/app/containers/activity/activity_end'

const getState = state => ({
  customer: state.customer,
  ...state.operation
})

@connect(getState)
class SavePromoCodeWallet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '正在领取优惠…'
    }
  }

  componentWillMount() {
    this.props.dispatch(Actions.operation.getOperationPlan('temp_vip'))
  }

  componentDidMount() {
    const id = this.props.customer.id,
      operation_plan = this.props.operation_plan
    if (id && !_.isEmpty(operation_plan) && operation_plan.promo_code.code) {
      this.getPromoCodeToWallet(operation_plan.promo_code.code)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.customer.id !== this.props.customer.id) {
      if (
        nextProps.customer.id &&
        !_.isEmpty(nextProps.operation_plan) &&
        nextProps.operation_plan.promo_code.code
      ) {
        this.getPromoCodeToWallet(nextProps.operation_plan.promo_code.code)
      }
    }
    if (nextProps.operation_plan !== this.props.operation_plan) {
      if (!_.isEmpty(nextProps.operation_plan))
        this.getPromoCodeToWallet(nextProps.operation_plan.promo_code.code)
    }
  }

  getPromoCodeToWallet = promo_code =>
    this.props.dispatch(
      Actions.promoCode.getPromoCodeToWallet({
        success: this.handleGetCodeSuccess,
        error: this.handleGetCodeError,
        promo_code
      })
    )

  handleGetCodeSuccess = () => {
    this.setState({
      text: '领取成功'
    })
    this.props.dispatch(Actions.currentCustomer.fetchMe(this.handleFetchMeSuc))
  }

  handleFetchMeSuc = () => this.linkToPlans()

  handleGetCodeError = () => {
    this.setState({
      text: '领取失败'
    })
    this.linkToPlans()
  }

  linkToPlans = (delayTime = 2000) =>
    setTimeout(
      () =>
        browserHistory.push({
          pathname: '/fiften_vip',
          query: this.props.location.query
        }),
      delayTime
    )

  render() {
    if (this.props.hasGetOperationPlan && _.isEmpty(this.props.operation_plan))
      return <ActivityEnd />
    return (
      <div>
        <PageHelmet title="Le Tote VIP 尊享" link={'/temp_vip'} />
        <Loading text={this.state.text} />
      </div>
    )
  }
}

export default SavePromoCodeWallet
