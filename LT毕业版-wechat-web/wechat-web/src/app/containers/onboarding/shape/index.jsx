import Header from 'src/app/containers/onboarding/utils_component/data_title'
import ActionButtons from 'src/app/containers/onboarding/utils_component/new_bottom_buttons'
import Actions from 'src/app/actions/actions'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import './index.scss'

class ShapeContainer extends React.Component {
  constructor(props) {
    super(props)
    const { shape } = props.customer.style
    this.state = { shape, isSubmit: false }

    this.config = [
      {
        title: '矩型',
        image: require('src/app/containers/onboarding/shape/images/slender.png'),
        value: 'Slender',
        content: '腰线不明显'
      },
      {
        title: '倒三角型',
        image: require('src/app/containers/onboarding/shape/images/heart.png'),
        value: 'Heart',
        content: '肩宽胯窄'
      },
      {
        title: '梨型',
        image: require('src/app/containers/onboarding/shape/images/pear.png'),
        value: 'Pear',
        content: '大腿粗臀部大'
      },
      {
        title: '沙漏型',
        image: require('src/app/containers/onboarding/shape/images/hourglass.png'),
        value: 'Hourglass',
        content: '腰细翘臀有胸'
      },
      {
        title: '苹果型',
        image: require('src/app/containers/onboarding/shape/images/apple.png'),
        value: 'Apple',
        content: '腰粗臀部大'
      }
    ]

    this.guessShape = this.getGuessShape()
  }

  getGuessShape = () => {
    const { shoulder_shape, waist_shape } = this.props.customer.style
    if (shoulder_shape === 'WIDE') return 'Heart'
    switch (waist_shape) {
      case 'SMALL':
        return 'Hourglass'
      case 'NORMAL':
        return 'Pear'
      case 'H':
        return 'Slender'
      case 'FAT':
        return 'Apple'
      default:
        return ''
    }
  }

  didSelectedItem = shape => {
    if (shape !== this.state.shape) {
      this.setState({ shape })
    }
  }

  onSubmit = () => {
    const { shape } = this.state
    const { dispatch, onboarding } = this.props

    if (!shape) {
      const tip = { isShow: true, content: '请先选择身型信息' }
      dispatch(Actions.tips.changeTips(tip))
      return
    }
    this.setState({ isSubmit: true })

    const style = { shape }
    dispatch(
      Actions.customerStyleInfo.updateUserDataAction({ data: { style } })
    )

    const routeName = onboarding.routerList[6]
    browserHistory.push(`/get-started/${routeName}`)
  }

  render() {
    const { shape, isSubmit } = this.state
    const { location } = this.props
    return (
      <div className="container-box">
        <PageHelmet title={'个人风格档案'} link={location.pathname} />
        <Header status={1} />
        <p className="shape-title">你属于哪种身型？</p>
        <div className="shape-box">
          {this.config.map(item => {
            const { value } = item
            const active = shape === value
            const isRecommend = this.guessShape === value
            return (
              <Item
                key={value}
                active={active}
                isRecommend={isRecommend}
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

function Item({ active, isRecommend, didSelectedItem, item }) {
  const { value, image, title, content } = item

  const onClick = () => {
    didSelectedItem && didSelectedItem(value)
  }

  const className = active ? 'shape-item active' : 'shape-item'
  return (
    <div className={className} onClick={onClick}>
      <img className="shape-icon" src={image} alt={title} />
      <p className="shape-item-title">{title}</p>
      <p className="shape-item-content">{content}</p>
      {active ? (
        <img
          className="active-icon"
          src={require('../style/images/active.png')}
          alt={'active'}
        />
      ) : null}
      {isRecommend ? <p className="shape-recommend">猜你是</p> : null}
    </div>
  )
}

function mapStateToProps(state) {
  return {
    onboarding: state.onboarding || {},
    customer: state.customer || {}
  }
}

export default connect(mapStateToProps)(ShapeContainer)
