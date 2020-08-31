import Header from 'src/app/containers/onboarding/utils_component/data_title'
// import SelectInput from 'src/app/containers/onboarding/utils_component/select_input'
import Actions from 'src/app/actions/actions'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import ActionButtons from 'src/app/containers/onboarding/utils_component/new_bottom_buttons'
import MeasurementPicker from 'src/app/components/MeasurementPicker'
import PageHelmet from 'src/app/lib/pagehelmet'
import Selector from 'src/app/containers/onboarding/utils_component/select_input/new_select'
import 'src/assets/stylesheets/mobile/style_profile.scss'

const MAX_HEIGHT = 190
const MIN_HEIGHT = 150
const MAX_WEIGHT = 80
const MIN_WEIGHT = 40

class BasicSizeContainer extends React.Component {
  constructor(props) {
    super(props)
    const { height_inches, weight, bra_size, cup_size } = props.customer.style
    const submitData = { height_inches, weight, bra_size, cup_size }

    this.state = { submitData, isShow: false, isSubmit: false }
  }

  renderListItems = (min, max) => {
    let items = []
    for (let i = min; i <= max; i++) {
      items.push(i)
    }
    return items
  }

  changeUserInfo = (info, activekey) => {
    let { submitData } = this.state
    submitData[activekey] = parseInt(info, 10)
    this.setState({ submitData })
  }

  handleShowPicker = () => {
    this.setState({ isShow: true })
  }

  handleBreathConfirm = (brasize, cupsize) => {
    let { submitData } = this.state
    submitData['bra_size'] = brasize
    submitData['cup_size'] = cupsize
    this.setState({ submitData, isShow: false })
  }

  handleBreathCancel = () => {
    this.setState({ isShow: false })
  }

  isUnFinished = () => {
    const { height_inches, weight, bra_size, cup_size } = this.state.submitData

    return !height_inches || !weight || !bra_size || !cup_size
  }

  onSubmit = () => {
    if (this.isUnFinished()) {
      const { dispatch } = this.props
      const tip = { isShow: true, content: '请先选择基础档案信息' }
      dispatch(Actions.tips.changeTips(tip))
      return
    }

    this.setState({ isSubmit: true }, () => {
      const { dispatch, onboarding } = this.props
      dispatch(
        Actions.customerStyleInfo.updateUserDataAction({
          data: { style: this.state.submitData },
          success: () => {
            const routeName = onboarding.routerList[2]
            browserHistory.push(`/get-started/${routeName}`)
          }
        })
      )
    })
  }

  render() {
    const { location } = this.props
    const { submitData, isSubmit } = this.state

    const braSize = !submitData.bra_size ? 75 : submitData.bra_size,
      cupSize = _.isEmpty(submitData.cup_size) ? 'B' : submitData.cup_size
    return (
      <div className="container-box">
        <PageHelmet title={'个人风格档案'} link={location.pathname} />
        <Header status={0} />
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          <Selector
            activeKey="height_inches"
            title="身高"
            placeholder="请选择你的身高"
            defaultValue={submitData.height_inches || ''}
            options={this.renderListItems(MIN_HEIGHT, MAX_HEIGHT)}
            unit="CM"
            onChange={this.changeUserInfo}
          />
          <Selector
            activeKey="weight"
            title="体重"
            placeholder="请选择你的体重"
            defaultValue={submitData.weight || ''}
            options={this.renderListItems(MIN_WEIGHT, MAX_WEIGHT)}
            unit="KG"
            onChange={this.changeUserInfo}
          />
          <div className="select-input">
            <p className="select-title">胸围</p>
            {!submitData.bra_size || !submitData.cup_size ? (
              <span
                className="new-selector-container placeholder"
                onClick={this.handleShowPicker}
              >
                请选择你的胸围
              </span>
            ) : (
              <span
                className="new-selector-container"
                onClick={this.handleShowPicker}
              >
                {submitData.bra_size} {submitData.cup_size}
              </span>
            )}
          </div>
          <MeasurementPicker
            visible={this.state.isShow}
            defaultValue={[braSize, cupSize]}
            onConfirm={this.handleBreathConfirm}
            onCancel={this.handleBreathCancel}
          />
        </div>
        <ActionButtons isSubmit={isSubmit} onFinished={this.onSubmit} />
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

export default connect(mapStateToProps)(BasicSizeContainer)
