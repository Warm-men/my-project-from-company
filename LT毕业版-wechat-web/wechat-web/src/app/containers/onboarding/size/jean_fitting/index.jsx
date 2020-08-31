import React from 'react'
import Header from 'src/app/containers/onboarding/utils_component/data_title'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import ActionButtons from 'src/app/containers/onboarding/utils_component/new_bottom_buttons'

import './index.scss'

class SizeJeanContainer extends React.Component {
  constructor(props) {
    super(props)
    this.config = [
      { title: '经常穿', value: 'OFTEN' },
      { title: '很少穿', value: 'SOMETIMES' },
      { title: '不穿', value: 'NEVER' }
    ]
    const { jean_prefer } = props.customer.style
    this.state = { jean_prefer, isSubmit: false }
  }

  didSelectedItem = jean_prefer => {
    if (jean_prefer !== this.state.jean_prefer) {
      this.setState({ jean_prefer })
    }
  }

  onSubmit = () => {
    const { jean_prefer } = this.state
    const { dispatch, onboarding } = this.props

    if (!jean_prefer) {
      const tip = { isShow: true, content: '请先选择常穿尺码信息' }
      dispatch(Actions.tips.changeTips(tip))
      return
    }
    this.setState({ isSubmit: true })

    const style = { jean_prefer }
    dispatch(
      Actions.customerStyleInfo.updateUserDataAction({ data: { style } })
    )

    const routeName =
      jean_prefer === 'NEVER'
        ? onboarding.routerList[10]
        : onboarding.routerList[9]
    browserHistory.push(`/get-started/${routeName}`)
  }

  render() {
    const { location } = this.props
    const { jean_prefer, isSubmit } = this.state

    return (
      <div className="onboarding-box">
        <PageHelmet title={'个人风格档案'} link={location.pathname} />
        <Header status={2} />
        <p className="size-jean-fitting-title">你最近一年穿过牛仔裤吗？</p>
        <p className="size-jean-fitting-content">
          包含长款与短款、不区分春夏秋冬
        </p>
        <div className="size-jean-fitting-box">
          {this.config.map(item => {
            const { title, value } = item
            const active = jean_prefer === value
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
  const divClass = active
    ? 'size-jean-fitting-item active'
    : 'size-jean-fitting-item'
  const spanClass = active
    ? 'size-jean-fitting-item-title-active'
    : 'size-jean-fitting-item-title'
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

export default connect(mapStateToProps)(SizeJeanContainer)
