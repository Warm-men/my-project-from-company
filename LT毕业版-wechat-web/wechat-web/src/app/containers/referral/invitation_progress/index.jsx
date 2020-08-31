import { connect } from 'react-redux'
import ProgressTable from './progress_table'
import PageHelmet from 'src/app/lib/pagehelmet'
import './index.scss'

const getState = state => ({
  customer: state.customer
})

export default connect(getState)(({ customer: { referrals } }) => (
  <div className="referral-progress-table">
    <PageHelmet title={'邀请进度'} link={`//referral_progress`} />
    <p>已成功邀请{referrals.length}人</p>
    <h5>好友加入会员7天后即可获得奖励金</h5>
    <ProgressTable referrals={referrals} />
  </div>
))
