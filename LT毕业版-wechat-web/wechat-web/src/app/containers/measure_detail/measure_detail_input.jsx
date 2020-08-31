import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions.js'
import calculateSize from 'src/app/lib/calculate_size'
import MeasureInput from 'src/app/containers/style_profile/fit_quiz/measure_input'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import ActionButton from 'src/app/components/shared/action_button/index'
import ArrowGray from 'src/assets/images/arrow_gray.png'
import PageHelmet from 'src/app/lib/pagehelmet'
import { FULL_DRESS_SIZE } from 'src/app/containers/onboarding/size.js'
import * as storage from 'src/app/lib/storage.js'
import './index.scss'
import 'src/assets/stylesheets/mobile/style_profile.scss'

class MeaSureDetailInput extends React.Component {
  constructor(props) {
    super(props)
    this.newStyle = props.style
    this.state = {
      style: { ...this.newStyle }
    }
  }

  handleConfirmMeasurement = (brasize, cupsize) => {
    const newStyle = this.state.style
    newStyle['bra_size'] = parseInt(brasize, 10)
    newStyle['cup_size'] = cupsize
    this.setState({
      style: { ...newStyle }
    })
  }

  handleMoreInput = () => {
    storage.remove('displayedTips')
    storage.set('isReceivedRule', true)
    this.props.router.push({
      pathname: '/style_profile/figure_input',
      query: { pre_page: 'nonMember_size' }
    })
  }

  handleValidSubmit = () => {
    const { style } = this.state
    if (
      !style.height_inches ||
      !style.weight ||
      !style.bra_size ||
      !style.cup_size
    ) {
      this.props.dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: this.handleSizeTips()
        })
      )
    } else {
      this.handleRecommend()
    }
  }

  handleSizeTips = () => {
    const { style } = this.state
    const unBreath = !style.bra_size || !style.cup_size
    let text = '请先填写'
    if (!style.height_inches) {
      text = `${text}${!style.weight || unBreath ? '身高、' : '身高'}`
    }
    if (!style.weight) {
      text = `${text}${!unBreath ? '体重' : '体重、'}`
    }
    if (unBreath) {
      text = `${text}胸围`
    }
    return text
  }

  handleRecommend = () => {
    const { style } = this.state
    let newStyle = {
      height_inches: style.height_inches,
      weight: style.weight,
      bra_size: style.bra_size,
      cup_size: style.cup_size
    }
    _.mapValues(newStyle, (v, k) => {
      if (!v) {
        delete newStyle[k]
      }
    })
    // NOTE:用户的KG体重转为斤
    const userWeight = newStyle.weight * 2
    const trackData = {
      height_inches: newStyle.height_inches,
      weight: newStyle.weight,
      bra_size: newStyle.bra_size,
      cup_size: newStyle.cup_size
    }
    const userCalSize = calculateSize(
      newStyle.height_inches,
      userWeight,
      trackData
    )
    const dress_size = FULL_DRESS_SIZE[userCalSize]
    const top_size = userCalSize
    this.props.dispatch(
      Actions.customerStyleInfo.updateUserDataAction({
        data: {
          style: { ...newStyle, dress_size, top_size }
        },
        success: this.props.router.goBack
      })
    )
  }

  handleHeightChange = e => {
    let { style } = this.state
    style.height_inches = parseInt(e.target.value, 10)
    this.setState({
      style
    })
  }

  handleWeightChange = e => {
    let { style } = this.state
    style.weight = parseInt(e.target.value, 10)
    this.setState({ style })
  }

  render() {
    const { style } = this.state
    return (
      <div className="quiz-wrapper">
        <PageHelmet title={'填写尺码'} link={`/measure_detail_input`} />
        <div className="measure-detail-input-container">
          <MeasureInput
            style={style}
            handleHeightChange={this.handleHeightChange}
            handleWeightChange={this.handleWeightChange}
            confirmBreath={this.handleConfirmMeasurement}
          />
          <p
            className="measure-detail-tips-text"
            onClick={this.handleMoreInput}
          >
            填写更多个人尺码数据
            <img src={ArrowGray} alt="" />
          </p>
        </div>
        <StickyButtonContainer>
          <ActionButton size="stretch" onClick={this.handleValidSubmit}>
            保存
          </ActionButton>
        </StickyButtonContainer>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { customer } = state
  return {
    customer_id: customer.id,
    style: customer.style
  }
}

export default connect(mapStateToProps)(withRouter(MeaSureDetailInput))
