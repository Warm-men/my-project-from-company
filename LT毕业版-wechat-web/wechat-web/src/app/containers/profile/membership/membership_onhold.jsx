import React from 'react'
import { connect } from 'react-redux'
import { format, addDays } from 'date-fns'
import 'src/assets/stylesheets/components/profile.scss'

class MembershipOnhold extends React.PureComponent {
  render() {
    const { subscription } = this.props.customer
    return (
      <div>
        <div className="membership-onhold">
          <div className="membership-image" />
          <p className="onhold-introduce">你的会员状态已暂停</p>
          <p className="onhold-date">
            将在
            {format(
              addDays(subscription.hold_date || subscription.hold_until, 1),
              'YYYY年MM月DD日'
            )}
            恢复
          </p>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    customer: state.customer
  }
}

export default connect(mapStateToProps)(MembershipOnhold)
