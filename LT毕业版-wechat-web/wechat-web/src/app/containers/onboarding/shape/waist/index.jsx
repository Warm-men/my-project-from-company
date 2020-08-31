import React from 'react'
import Header from 'src/app/containers/onboarding/utils_component/data_title'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import ActionButtons from 'src/app/containers/onboarding/utils_component/new_bottom_buttons'

import './index.scss'

class ShapeWaistContainer extends React.Component {
  constructor(props) {
    super(props)
    this.config = [
      {
        title: '小蛮腰',
        content: '偏瘦，腰特别细',
        image: require('./images/small.png'),
        value: 'SMALL'
      },
      {
        title: '有腰线',
        content: '微胖，腰相对较细',
        image: require('./images/normal.png'),
        value: 'NORMAL'
      },
      {
        title: '无腰线',
        content: '腰线不明显',
        image: require('./images/h.png'),
        value: 'H'
      },
      {
        title: '腰部胖',
        content: '腰部粗，显肚子',
        image: require('./images/fat.png'),
        value: 'FAT'
      }
    ]

    const { waist_shape } = props.customer.style
    this.state = { waist_shape, isSubmit: false }
  }

  didSelectedItem = waist_shape => {
    if (waist_shape !== this.state.waist_shape) {
      this.setState({ waist_shape })
    }
  }

  onSubmit = () => {
    const { waist_shape } = this.state
    const { dispatch, onboarding } = this.props

    if (!waist_shape) {
      const tip = { isShow: true, content: '请先选择身型信息' }
      dispatch(Actions.tips.changeTips(tip))
      return
    }
    this.setState({ isSubmit: true })

    const style = { waist_shape }
    dispatch(
      Actions.customerStyleInfo.updateUserDataAction({ data: { style } })
    )

    const routeName = onboarding.routerList[3]
    browserHistory.push(`/get-started/${routeName}`)
  }

  render() {
    const { location } = this.props
    const { isSubmit, waist_shape } = this.state
    return (
      <div className="onboarding-box">
        <PageHelmet title={'个人风格档案'} link={location.pathname} />
        <Header status={1} />
        <p className="shape-waist-title">你属于哪种腰型？</p>
        <div className="shape-waist-box">
          {this.config.map(item => {
            const { value, title } = item
            const active = waist_shape === value
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
  const { title, content, image, value } = item

  const onClick = () => {
    didSelectedItem && didSelectedItem(value)
  }

  const className = active ? 'shape-waist-item active' : 'shape-waist-item'
  return (
    <div className={className} onClick={onClick}>
      <img className="shape-waist-icon" src={image} alt={title} />
      <p className="shape-waist-item-title">{title}</p>
      <p className="shape-waist-item-content">{content}</p>
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

export default connect(mapStateToProps)(ShapeWaistContainer)
