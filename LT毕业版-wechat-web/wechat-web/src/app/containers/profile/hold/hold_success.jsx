import React from 'react'
import { connect } from 'react-redux'
import { format } from 'date-fns'
import 'src/assets/stylesheets/components/profile.scss'

class HoldSuccess extends React.PureComponent {
  render() {
    const { subscription } = this.props.customer
    return (
      <div>
        <div className="membership-onhold">
          <div className="membership-image" />
          <p className="onhold-introduce">
            你已经申请暂停到
            {format(
              subscription.hold_date || subscription.hold_until,
              'YYYY年MM月DD日'
            )}
          </p>
          <p className="onhold-date">
            确认已归还所有商品后，将会开始暂停，并相应地延长你的会员有效期
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

export default connect(mapStateToProps)(HoldSuccess)
