import { Picker, Popup } from 'src/app/components/spring-picker/index.jsx'
import PropTypes from 'prop-types'
import times from './utils/times'
import WithHandleTouch from 'src/app/components/HOC/with_handletouch'
import 'src/app/components/spring-picker/style.css'
import './index.scss'

class RangeDatePicker extends React.Component {
  constructor(props) {
    super(props)
    this.date = []
    this.index = 0
    this.state = {
      times: {
        list: times,
        defaultValue: props.defaultValue[0],
        displayValue: name => {
          return name
        }
      }
    }
  }

  handleChangeDate = time => {
    this.setState(state => ({
      times: {
        ...state.times,
        list: times,
        defaultValue: time
      }
    }))
    this.date = []
    this.date.push(time)
    this.index = times.indexOf(time)
    this.props.onChange(this.date, this.index)
  }

  handleClose = () => this.props.onConfirm(this.date, this.index)

  handleCancel = () => this.props.onCancel()

  render() {
    return (
      <div className="range-picker">
        <Popup
          onConfirm={this.handleClose}
          onCancel={this.handleCancel}
          visible={this.props.visible}
        >
          <Picker
            onChange={_.debounce(this.handleChangeDate, 100, {
              leading: true
            })}
            data={this.state.times}
          />
        </Popup>
      </div>
    )
  }
}

RangeDatePicker.propTypes = {
  defaultValue: PropTypes.array.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired
}

RangeDatePicker.defaultProps = {
  defaultValue: [times[0]],
  onConfirm: () => {},
  onCancel: () => {},
  onChange: () => {},
  visible: false
}

export default WithHandleTouch(RangeDatePicker)
