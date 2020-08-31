import ApplyFail from './apply_fail'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import ApplySuccess from './apply_success'
import { browserHistory } from 'react-router'
import * as storage from 'src/app/lib/storage.js'
import { Questionnaire_Address } from '../../../constants/global_config'

const getState = state => {
  const { subscriptionTypes, customer } = state
  // FIXME:目前使用is_signupable判断，后期有多个可购买套餐需要调整规则
  const subscriptionData = _.filter(
    subscriptionTypes,
    subscription => subscription.is_signupable === true
  )
  return {
    data: subscriptionData[0],
    customer
  }
}

@connect(getState)
class ApplicationResult extends Component {
  constructor(props) {
    super(props)
    this.MEET_REQUIREMENT_SCORES = 650
  }

  componentWillUnmount() {
    storage.remove('APPLY_CLOTHES_FREE')
  }

  componentWillReceiveProps(nextProps) {
    const {
      customer: { credit_scores }
    } = nextProps
    const score = credit_scores[0] && Number(credit_scores[0].score)
    this.isMeetRequirement = score >= this.MEET_REQUIREMENT_SCORES
    if (this.isMeetRequirement && storage.get('LETOTE_FREE_TOTE_79')) {
      browserHistory.replace('/promo_plans?promo_code=LTCN_FREE_TOTE_79')
    }
  }

  handleGoTotes = () => {
    window.location.href = Questionnaire_Address[window.currentEnv]
  }
  render() {
    const {
      customer: { credit_scores }
    } = this.props
    const score = credit_scores[0] && Number(credit_scores[0].score)
    return this.isMeetRequirement ? (
      <ApplySuccess handleGoTotes={this.handleGoTotes} score={score} />
    ) : (
      <ApplyFail score={score} {...this.props} />
    )
  }
}

export default ApplicationResult
