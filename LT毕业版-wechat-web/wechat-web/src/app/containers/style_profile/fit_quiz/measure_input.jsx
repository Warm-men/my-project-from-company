import { browserHistory } from 'react-router'
import 'src/assets/stylesheets/mobile/style_profile.scss'
import MeasurementPicker from 'src/app/components/MeasurementPicker'

const MAX_HEIGHT = 190
const MIN_HEIGHT = 150
const MAX_WEIGHT = 80
const MIN_WEIGHT = 40

class MeaSureInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false
    }
  }

  handleShowPicker = () => {
    this.props.showMeasureInput && this.props.showMeasureInput()
    this.setState({
      isShow: true
    })
  }

  handleBreathConfirm = (brasize, cupsize) => {
    this.props.confirmBreath && this.props.confirmBreath(brasize, cupsize)
    this.setState({
      isShow: false
    })
  }

  handleBreathCancel = () => {
    this.props.cancelBreath && this.props.cancelBreath()
    this.setState({
      isShow: false
    })
  }

  renderListItems = (min, max, unit) => {
    let items = [
      <option value="" className="hide" disabled key="">
        请选择
      </option>
    ]
    for (let i = min; i <= max; i++) {
      items.push(
        <option value={i} key={i}>
          {i}
          {unit}
        </option>
      )
    }
    return items
  }

  gotoBreathTips = () => browserHistory.push('/breath_introduce')

  render() {
    const {
      style,
      handleHeightChange,
      handleWeightChange,
      isHideInput
    } = this.props
    const braSize = !style.bra_size ? 75 : style.bra_size,
      cupSize = _.isEmpty(style.cup_size) ? 'B' : style.cup_size
    return (
      <div className="user-input-container">
        <div className="user-input-title">
          我们始终坚持手工测量每件衣服，只需提供尺码信息，托特衣箱就能为你推荐最合身的尺码
        </div>
        <div className="user-input-wrapper">
          <div className="input-heading">身高</div>
          <select
            value={style.height_inches || ''}
            className="height-selector selector-style"
            onChange={handleHeightChange}
          >
            {this.renderListItems(MIN_HEIGHT, MAX_HEIGHT, 'cm')}
          </select>
        </div>
        <div className="user-input-wrapper">
          <div className="input-heading">体重</div>
          <select
            value={style.weight || ''}
            className="height-selector selector-style"
            onChange={handleWeightChange}
          >
            {this.renderListItems(MIN_WEIGHT, MAX_WEIGHT, 'kg')}
          </select>
        </div>
        <div className="user-input-wrapper">
          <div className="input-heading">胸围</div>
          <span
            className="height-selector selector-style"
            onClick={this.handleShowPicker}
          >
            {`${
              !style.bra_size || !style.cup_size
                ? '请选择'
                : `${style.bra_size} ${style.cup_size}`
            }`}
          </span>
        </div>
        {!isHideInput && (
          <MeasurementPicker
            defaultValue={[braSize, cupSize]}
            onConfirm={this.handleBreathConfirm}
            onCancel={this.handleBreathCancel}
            visible={this.state.isShow}
          />
        )}
      </div>
    )
  }
}

export default MeaSureInput
