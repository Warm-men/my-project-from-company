import React from 'react'
import Header from 'src/app/containers/onboarding/utils_component/data_title'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import ActionButtons from 'src/app/containers/onboarding/utils_component/new_bottom_buttons'

import './index.scss'

class ShapeShoulderContainer extends React.Component {
  constructor(props) {
    super(props)
    this.config = [
      { title: '较窄', value: 'LITTLE_NARROW' },
      { title: '正常', value: 'NORMAL' },
      { title: '较宽', value: 'LITTLE_WIDE' },
      { title: '很宽', value: 'WIDE' }
    ]
    const { shoulder_shape } = props.customer.style
    this.state = { shoulder_shape, isSubmit: false }
  }

  didSelectedItem = shoulder_shape => {
    if (shoulder_shape !== this.state.shoulder_shape) {
      this.setState({ shoulder_shape })
    }
  }

  onSubmit = () => {
    const { shoulder_shape } = this.state
    const { dispatch, onboarding } = this.props

    if (!shoulder_shape) {
      const tip = { isShow: true, content: '请先选择身型信息' }
      dispatch(Actions.tips.changeTips(tip))
      return
    }
    this.setState({ isSubmit: true })

    const style = { shoulder_shape }
    dispatch(
      Actions.customerStyleInfo.updateUserDataAction({
        data: { style },
        success: () => {
          const routeName = onboarding.routerList[5]
          browserHistory.push(`/get-started/${routeName}`)
        }
      })
    )
  }

  render() {
    const { location } = this.props
    const { shoulder_shape, isSubmit } = this.state
    return (
      <div className="onboarding-box">
        <PageHelmet title={'个人风格档案'} link={location.pathname} />
        <Header status={1} />
        <p className="shape-shoulder-title">你的肩膀宽吗？</p>
        <div className="shape-shoulder-box">
          {this.config.map(item => {
            const { title, value } = item
            const active = shoulder_shape === value
            return (
              <Item
                key={title}
                active={active}
                title={title}
                value={value}
                didSelectedItem={this.didSelectedItem}
              />
            )
          })}
        </div>
        <ActionButtons isSubmit={isSubmit} onFinished={this.onSubmit} />
      </div>
    )
  }
}

function Item({ title, value, active, didSelectedItem }) {
  const divClass = active ? 'shape-shoulder-item active' : 'shape-shoulder-item'
  const spanClass = active
    ? 'shape-shoulder-item-title-active'
    : 'shape-shoulder-item-title'
  const onClick = () => {
    didSelectedItem && didSelectedItem(value)
  }

  return (
    <div className={divClass} onClick={onClick}>
      <span className={spanClass}>{title}</span>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    onboarding: state.onboarding || {},
    customer: state.customer || {}
  }
}

export default connect(mapStateToProps)(ShapeShoulderContainer)
