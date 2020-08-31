import React from 'react'
import Header from 'src/app/containers/onboarding/utils_component/data_title'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import ActionButtons from 'src/app/containers/onboarding/utils_component/new_bottom_buttons'

import { SKIRT_SIZES } from 'src/app/containers/onboarding/size.js'
import './index.scss'

class SizeSkirtContainer extends React.Component {
  constructor(props) {
    super(props)
    this.config = [
      { title: '有点松', value: 'LOOSE' },
      { title: '刚好合身', value: 'FIT' },
      { title: '有点紧', value: 'TIGHT' },
      { title: '我不确定', value: 'NOTSURE' }
    ]
    const { skirt_habit } = props.customer.style
    this.state = { skirt_habit, isSubmit: false }
  }

  didSelectedItem = skirt_habit => {
    if (skirt_habit !== this.state.skirt_habit) {
      this.setState({ skirt_habit })
    }
  }

  onSubmit = () => {
    const { skirt_habit } = this.state
    const { dispatch, onboarding } = this.props

    if (!skirt_habit) {
      const tip = { isShow: true, content: '请先选择常穿尺码信息' }
      dispatch(Actions.tips.changeTips(tip))
      return
    }
    this.setState({ isSubmit: true })

    const style = { skirt_habit }
    dispatch(
      Actions.customerStyleInfo.updateUserDataAction({ data: { style } })
    )

    const routeName = onboarding.routerList[8]
    browserHistory.push(`/get-started/${routeName}`)
  }

  render() {
    const { location, customer } = this.props
    const { skirt_habit, isSubmit } = this.state
    const { skirt_size } = customer.style

    const size = SKIRT_SIZES.find(item => item.type === skirt_size).name

    return (
      <div className="onboarding-box">
        <PageHelmet title={'个人风格档案'} link={location.pathname} />
        <Header status={2} />
        <p className="size-skirt-title">半裙的穿着体验</p>
        <p className="size-skirt-content">
          你选择的常穿尺码是 {size} ，如果<span>{'腰部无弹力且没有腰带'}</span>
          ，你穿这个尺码腰部松紧效果一般会是哪种？
        </p>
        <div className="size-skirt-box">
          {this.config.map(item => {
            const { title, value } = item
            const active = skirt_habit === value
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
  const divClass = active ? 'size-skirt-item active' : 'size-skirt-item'
  const spanClass = active
    ? 'size-skirt-item-title-active'
    : 'size-skirt-item-title'

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

export default connect(mapStateToProps)(SizeSkirtContainer)
