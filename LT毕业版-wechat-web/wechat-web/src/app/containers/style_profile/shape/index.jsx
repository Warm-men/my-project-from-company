import ActionButton from 'src/app/components/shared/action_button/index.jsx'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import Actions from 'src/app/actions/actions'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import 'src/assets/stylesheets/mobile/style_profile.scss'
import './index.scss'

class ShapeContainer extends React.Component {
  constructor(props) {
    super(props)
    const { shape } = props.customer.style
    this.state = { shape, isSubmit: false }

    this.shapeData = [
      {
        display: '矩型',
        src: require('src/app/containers/style_profile/shape/images/slender.png'),
        value: 'Slender'
      },
      {
        display: '倒三角型',
        src: require('src/app/containers/style_profile/shape/images/heart.png'),
        value: 'Heart'
      },
      {
        display: '梨型',
        src: require('src/app/containers/style_profile/shape/images/pear.png'),
        value: 'Pear'
      },
      {
        display: '沙漏型',
        src: require('src/app/containers/style_profile/shape/images/hourglass.png'),
        value: 'Hourglass'
      },
      {
        display: '苹果型',
        src: require('src/app/containers/style_profile/shape/images/apple.png'),
        value: 'Apple'
      }
    ]
  }

  handleSelect = shape => () => {
    this.setState({ shape })
  }

  onSubmit = () => {
    this.setState({ isSubmit: true }, () => {
      const { dispatch, router } = this.props
      dispatch(
        Actions.customerStyleInfo.updateUserDataAction({
          data: { style: { shape: this.state.shape } },
          success: (dispatch, res) => {
            const { incentive_granted } = res.data.UpdateStyle
            if (incentive_granted) {
              browserHistory.replace('/complete_size_success')
              return null
            }
            router.goBack()
          }
        })
      )
    })
  }

  render() {
    const { shape } = this.state
    return (
      <div>
        <PageHelmet title={'身型'} link={this.props.location.pathname} />
        <div className="shape-container">
          {_.map(this.shapeData, ({ value, src, display }, k) => {
            const isSelect = shape === value
            return (
              <div
                onClick={this.handleSelect(value)}
                className="shape-box"
                key={k}
              >
                <img className="shape-img" src={src} alt={display} />
                <span className={`shape-display ${isSelect ? 'select' : ''}`}>
                  {display}
                </span>
              </div>
            )
          })}
        </div>
        <StickyButtonContainer isSingle>
          <ActionButton disabled={!shape} onClick={this.onSubmit}>
            保存
          </ActionButton>
        </StickyButtonContainer>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    onboarding: state.onboarding || {},
    customer: state.customer || {}
  }
}

export default connect(mapStateToProps)(ShapeContainer)
