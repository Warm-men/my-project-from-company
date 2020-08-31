import React from 'react'
import Header from 'src/app/containers/onboarding/utils_component/data_title'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import ActionButtons from 'src/app/containers/onboarding/utils_component/new_bottom_buttons'

import './index.scss'

import { JEAN_SIZES } from '../../size'

class SizeJeanContainer extends React.Component {
  constructor(props) {
    super(props)
    this.config = [...JEAN_SIZES, { name: '不知道', type: 'Unknow' }]
    this.configFitting = [
      { name: '有点松', type: 'LOOSE' },
      { name: '刚好合身', type: 'FIT' },
      { name: '有点紧', type: 'TIGHT' }
    ]

    this.descriptions = {
      23: { size: 'XS', info: '', waist: 57, hips: 80 },
      24: { size: 'XS', info: '', waist: 60, hips: 83 },
      25: { size: 'S', info: '155/62A', waist: 62, hips: 85 },
      26: { size: 'S', info: '159/64A', waist: 65, hips: 88 },
      27: { size: 'M', info: '160/66A', waist: 67, hips: 90 },
      28: { size: 'M', info: '164/68A', waist: 70, hips: 93 },
      29: { size: 'L', info: '165/70A', waist: 72, hips: 95 },
      30: { size: 'L', info: '169/72A', waist: 75, hips: 98 },
      31: { size: 'XL', info: '170/74A', waist: 77, hips: 100 },
      32: { size: 'XL', info: '170/76A', waist: 80, hips: 103 }
    }

    const { jean_waist_fit, jean_size_unknow, jean_size } = props.customer.style
    this.state = {
      jean_waist_fit,
      jean_size_unknow,
      jean_size,
      isSubmit: false
    }
  }

  didSelectedSize = data => {
    if (data === 'Unknow') {
      this.setState({
        jean_size: null,
        jean_waist_fit: null,
        jean_size_unknow: data
      })
    } else {
      this.setState({ jean_size: data, jean_size_unknow: null })
    }
  }

  didSelectedFittingItem = jean_waist_fit => {
    if (jean_waist_fit !== this.state.jean_waist_fit) {
      this.setState({ jean_waist_fit })
    }
  }

  onSubmit = () => {
    const { jean_waist_fit, jean_size, jean_size_unknow } = this.state
    const { dispatch, onboarding } = this.props

    if (!jean_size && !jean_size_unknow) {
      const tip = { isShow: true, content: '请先选择常穿尺码信息' }
      dispatch(Actions.tips.changeTips(tip))
      return
    }

    if (jean_size && !jean_waist_fit) {
      const tip = { isShow: true, content: '请先选择常穿尺码信息' }
      dispatch(Actions.tips.changeTips(tip))
      return
    }

    this.setState({ isSubmit: true })

    const style = {}
    style.jean_size_unknow = jean_size_unknow
    style.jean_size = jean_size
    style.jean_waist_fit = jean_waist_fit

    dispatch(
      Actions.customerStyleInfo.updateUserDataAction({ data: { style } })
    )

    const routeName = onboarding.routerList[10]
    browserHistory.push(`/get-started/${routeName}`)
  }

  getContent = () => {
    let content = ''
    const { jean_size } = this.state
    if (jean_size) {
      const data = this.descriptions[jean_size]
      if (data) {
        const { size, info, waist, hips } = data
        content = [
          `${jean_size}码≈ ${size}码`,
          `${info ? '国标' : ''}${info}`,
          `腰围${waist}cm`,
          `臀围${hips}cm`
        ]
          .filter(a => !!a)
          .join('，')
      }
    }
    return content
  }

  render() {
    const { location } = this.props
    const { jean_waist_fit, jean_size, jean_size_unknow, isSubmit } = this.state

    const content = this.getContent()
    return (
      <div className="onboarding-box">
        <PageHelmet title={'个人风格档案'} link={location.pathname} />
        <Header status={2} />
        <p className="size-jean-title">牛仔裤常穿哪个尺码？</p>
        <div className="size-jean-box">
          {this.config.map(item => {
            const { name, type } = item
            const active = jean_size === type || jean_size_unknow === type
            return (
              <Item
                key={name}
                active={active}
                title={name}
                value={type}
                didSelectedItem={this.didSelectedSize}
              />
            )
          })}
        </div>

        {jean_size && content ? (
          <span className="size-jean-size-info">{content}</span>
        ) : null}

        {jean_size ? (
          <div>
            <p className="size-jean-title">这个尺码的腰部松紧效果如何？</p>
            <div className="size-jean-box">
              {this.configFitting.map(item => {
                const { name, type } = item
                const active = jean_waist_fit === type
                return (
                  <Item
                    key={name}
                    active={active}
                    title={name}
                    value={type}
                    didSelectedItem={this.didSelectedFittingItem}
                  />
                )
              })}
            </div>
          </div>
        ) : null}

        <ActionButtons isSubmit={isSubmit} onFinished={this.onSubmit} />
      </div>
    )
  }
}

function Item({ title, value, active, didSelectedItem }) {
  const divClass = active ? 'size-jean-item active' : 'size-jean-item'
  const spanClass = active
    ? 'size-jean-item-title-active'
    : 'size-jean-item-title'
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
