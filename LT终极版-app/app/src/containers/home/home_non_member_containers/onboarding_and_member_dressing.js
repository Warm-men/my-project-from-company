/* @flow */

import React, { Component } from 'react'
import { View } from 'react-native'
import { inject, observer } from 'mobx-react'
import { Column } from '../../../expand/tool/add_to_closet_status'
import { abTrack, Experiment, Variant } from '../../../components/ab_testing'
import { onClickJoinMember } from '../../../expand/tool/plans/join_member'
import Onboarding from './onboarding'
import MemberDressing from './member_dressing'
@inject('totesStore', 'currentCustomerStore')
@observer
export default class OnboardingAndRecommendTote extends Component {
  _didSelectedItem = product => {
    const column = Column.CurrentTote
    this.props.navigation.navigate('Details', { item: product, column })
  }

  _goOnboardingTote = () => {
    this.props.navigation.navigate('OnboardingTote')
  }

  _goJoinMember = () => {
    abTrack('onboarding_13', 1)
    const { navigation } = this.props
    onClickJoinMember(navigation)
    navigation.navigate('JoinMember')
  }

  _onRefreshingMemberDressingComponent = () => {
    this._memberDressing && this._memberDressing._getRecommendTote()
  }

  render() {
    const { totesStore, navigation } = this.props
    const { latest_rental_tote } = totesStore

    if (latest_rental_tote) {
      return <OnboardingView navigation={navigation} />
    }

    return (
      <View>
        <Experiment
          defaultValue={1}
          flagName={'non_member_home_customer_photo'}>
          <Variant value={1}>
            <OnboardingView navigation={navigation} />
          </Variant>
          <Variant value={2}>
            <MemberDressing
              ref={memberDressing => (this._memberDressing = memberDressing)}
              titleText={'会员晒穿搭'}
              navigation={navigation}
            />
          </Variant>
        </Experiment>
      </View>
    )
  }
}

class OnboardingView extends Component {
  render() {
    const { navigation } = this.props
    return (
      <Experiment
        defaultValue={3}
        flagName={'onboarding_tote'}
        delayTimes={500}>
        <Variant value={1}>
          <Onboarding navigation={navigation} buttonTitle={'立即体验'} />
        </Variant>
        <Variant value={2}>
          <Onboarding navigation={navigation} buttonTitle={'开始定制'} />
        </Variant>
        <Variant value={3} />
      </Experiment>
    )
  }
}
