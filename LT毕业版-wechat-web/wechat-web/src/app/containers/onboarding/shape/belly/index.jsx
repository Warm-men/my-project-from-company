import React from 'react'
import Header from 'src/app/containers/onboarding/utils_component/data_title'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import ActionButtons from 'src/app/containers/onboarding/utils_component/new_bottom_buttons'

import './index.scss'

class ShapeBellyContainer extends React.Component {
  constructor(props) {
    super(props)
    this.config = [
      {
        title: '有马甲线',
        image: require('./images/waist_coat.png'),
        value: 'WAISTCOAT'
      },
      {
        title: '平坦无小肚腩',
        image: require('./images/flat.png'),
        value: 'FLAT'
      },
      {
        title: '有轻微小肚腩',
        image: require('./images/slight.png'),
        value: 'SLIGHT'
      },
      {
        title: '有明显小肚腩',
        image: require('./images/obvious.png'),
        value: 'OBVIOUS'
      },
      {
        title: '有大肚腩',
        image: require('./images/pot.png'),
        value: 'POT'
      }
    ]
    const { belly_shape } = props.customer.style
    this.state = { belly_shape, isSubmit: false }
  }

  didSelectedItem = belly_shape => {
    if (belly_shape !== this.state.belly_shape) {
      this.setState({ belly_shape })
    }
  }

  onSubmit = () => {
    const { belly_shape } = this.state
    const { dispatch, onboarding } = this.props

    if (!belly_shape) {
      const tip = { isShow: true, content: '请先选择身型信息' }
      dispatch(Actions.tips.changeTips(tip))
      return
    }
    this.setState({ isSubmit: true })

    const style = { belly_shape }
    dispatch(
      Actions.customerStyleInfo.updateUserDataAction({ data: { style } })
    )

    const routeName = onboarding.routerList[4]
    browserHistory.push(`/get-started/${routeName}`)
  }

  render() {
    const { location } = this.props
    const { isSubmit, belly_shape } = this.state
    return (
      <div className="onboarding-box">
        <PageHelmet title={'个人风格档案'} link={location.pathname} />
        <Header status={1} />
        <p className="shape-belly-title">你有小肚腩吗？</p>
        <div className="shape-belly-box">
          {this.config.map(item => {
            const { value, title } = item
            const active = belly_shape === value
            return (
              <Item
                key={title}
                active={active}
                item={item}
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

function Item({ active, didSelectedItem, item }) {
  const { title, image, value } = item
  const onClick = () => {
    didSelectedItem && didSelectedItem(value)
  }

  const className = active ? 'shape-belly-item active' : 'shape-belly-item'
  return (
    <div className={className} onClick={onClick}>
      <img className="shape-belly-icon" src={image} alt={title} />
      <p className="shape-belly-item-title">{title}</p>
      {active ? (
        <img
          className="active-icon"
          src={require('../../style/images/active.png')}
          alt={'active'}
        />
      ) : null}
    </div>
  )
}

function mapStateToProps(state) {
  return {
    onboarding: state.onboarding || {},
    customer: state.customer || {}
  }
}

export default connect(mapStateToProps)(ShapeBellyContainer)
