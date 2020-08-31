import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import './index.scss'
import PageHelmet from 'src/app/lib/pagehelmet'

class ScheduleFail extends PureComponent {
  render() {
    const { location } = this.props.router

    return (
      <div className="schedule-fail">
        <PageHelmet title="预约结果" link="/schedule_fail" />
        <div className="fail-img" />
        {location.state.isError && [
          <p key="fail-title-large" className="fail-title-large">
            重新预约失败
          </p>,
          <p key="fail-title-small" className="fail-title-small">
            请返回重试或直接联系顺丰小哥协商
          </p>
        ]}
        {!location.state.isError && (
          <p className="fail-title-middle">顺丰已揽件</p>
        )}
        <Link className="fail-btn" to="/totes">
          返回衣箱
        </Link>
      </div>
    )
  }
}

export default connect()(ScheduleFail)
