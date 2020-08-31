import { Picker, Popup } from 'src/app/components/spring-picker/index.jsx'
import PropTypes from 'prop-types'
import date from './utils/date.json'
import { format, addHours } from 'date-fns'
import time from './utils/time.json'
import WithHandleTouch from 'src/app/components/HOC/with_handletouch'

import 'src/app/components/spring-picker/style.css'
import './index.scss'
class TimePicker extends React.Component {
  constructor(props) {
    super(props)
    this.cityTime = props.lastCityTime.replace(/:/g, '')
    this.validMoment = _.filter(
      time,
      value =>
        parseInt(value.replace(/:/g, ''), 10) <= parseInt(this.cityTime, 10)
    )
    this.state = {
      returnTime: {
        list: date,
        defaultValue: props.defaultValue[0],
        displayValue: name => name
      },
      returnMoment: {
        list: this.validMoment,
        defaultValue: props.defaultValue[1],
        displayValue: name => name
      }
    }
    this.returnTime = null
    this.returnMoment = null
  }

  componentWillMount() {
    this.initTimePicker()
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.lastCityTime &&
      nextProps.lastCityTime !== this.props.lastCityTime
    ) {
      this.cityTime = nextProps.lastCityTime.replace(/:/g, '')
      this.validMoment = _.filter(
        time,
        value =>
          parseInt(value.replace(/:/g, ''), 10) <= parseInt(this.cityTime, 10)
      )
      this.initTimePicker()
    }
  }

  selectTomorrow = isTomorrow => {
    this.setState(state => {
      const newState = { ...state }
      return {
        returnTime: {
          ...newState.returnTime,
          list: isTomorrow ? [date[1]] : date,
          defaultValue: date[1]
        },
        returnMoment: {
          ...newState.returnMoment,
          defaultValue: this.validMoment[0],
          list: this.validMoment
        }
      }
    })
    this.returnMoment = this.validMoment[0]
  }

  selectToday = () => {
    const startTime = format(addHours(new Date(), 1), 'HHmm')
    const newList = _.filter(
      this.validMoment,
      value => parseInt(startTime, 10) <= parseInt(value.replace(/:/g, ''), 10)
    )
    this.setState(state => ({
      returnTime: {
        ...state.returnTime,
        list: date,
        defaultValue: date[0]
      },
      returnMoment: {
        ...state.returnMoment,
        defaultValue: newList[0],
        list: newList
      }
    }))
    this.returnMoment = newList[0]
  }

  isTomorrow = () => {
    const startTime = format(new Date(), 'HHmm')
    const endTime = this.cityTime
    return parseInt(startTime, 10) > parseInt(endTime, 10) - 100
  }

  initTimePicker = selectdate => {
    if (this.isTomorrow()) {
      this.returnTime = '明天'
      this.selectTomorrow(true)
    } else {
      if (selectdate === date[1]) {
        this.selectTomorrow(false)
      } else {
        this.selectToday()
      }
    }
  }

  handleConfirm = () => {
    this.props.onConfirm(this.returnTime, this.returnMoment)
    this.handleCancel()
  }

  handleCancel = () => this.props.onCancel && this.props.onCancel()

  changeSelectDate = value => {
    if (this.returnTime !== value) {
      this.returnTime = value
      this.initTimePicker(value)
    }
  }

  changeSelectMoment = value => (this.returnMoment = value)

  render() {
    return (
      <div className="ui-picker-address">
        <Popup
          onConfirm={this.handleConfirm}
          onCancel={this.handleCancel}
          visible={this.props.visible}
        >
          <Picker
            onChange={this.changeSelectDate}
            data={this.state.returnTime}
          />
          <Picker
            onChange={this.changeSelectMoment}
            data={this.state.returnMoment}
          />
        </Popup>
      </div>
    )
  }
}

TimePicker.propTypes = {
  defaultValue: PropTypes.array.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired
}

TimePicker.defaultProps = {
  defaultValue: ['今天', format(new Date(), 'HH:mm')],
  lastCityTime: '17:00',
  onConfirm: () => {},
  onCancel: () => {},
  onChange: () => {},
  visible: false
}

export default WithHandleTouch(TimePicker)
