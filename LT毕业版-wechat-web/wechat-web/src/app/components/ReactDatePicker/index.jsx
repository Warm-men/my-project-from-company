import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-mobile-datepicker'
import { format } from 'date-fns'
import './index.scss'

class ReactDatePicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      time: this.props.defaultDate || new Date(),
      isOpen: false,
      isFirstSelect: true
    }
    this.dateConfig = {
      year: {
        format: 'YYYY年',
        caption: 'Year',
        step: 1
      },
      month: {
        format: 'MM月',
        caption: 'Mon',
        step: 1
      },
      date: {
        format: 'DD日',
        caption: 'Day',
        step: 1
      }
    }
    this.typeCofing = {
      hour: {
        format: 'hh',
        caption: 'Hour',
        step: 1
      },
      minute: {
        format: 'mm',
        caption: 'Min',
        step: 1
      },
      second: {
        format: 'hh',
        caption: 'Sec',
        step: 1
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultDate && nextProps.defaultDate !== this.state.time) {
      this.setState({
        time: nextProps.defaultDate
      })
    }
  }

  handleClick = () => {
    const { togglePicker } = this.props
    this.setState({ isOpen: true }, () => {
      togglePicker && togglePicker(true)
    })
  }
  handleSelect = time => {
    const { handleDateSelected, togglePicker } = this.props
    this.setState(
      {
        time: time,
        isOpen: false,
        isFirstSelect: false
      },
      () => {
        togglePicker && togglePicker(false)
      }
    )
    handleDateSelected(time)
  }
  handleCancel = () => {
    const { togglePicker } = this.props
    this.setState({ isOpen: false }, () => {
      togglePicker && togglePicker(false)
    })
  }
  formatDate = (type, time) =>
    format(time, type === 'date' ? 'YYYY-MM-DD' : 'HH:mm:ss')
  render() {
    const { type } = this.props
    const { time, isOpen, isFirstSelect } = this.state
    const hadFristSelect = isFirstSelect && !this.props.defaultDate
    const isDate = type === 'date'
    return (
      <div className="date-pick">
        <span
          className={hadFristSelect ? 'select-btn' : 'select-btn select'}
          onClick={this.handleClick}
        >
          {((type, time) => {
            if (hadFristSelect) {
              const text = type === 'date' ? '请选择日期' : '请选择时间'
              return this.props.placeholder || text
            } else {
              if (type === 'date') {
                return format(time, 'YYYY-MM-DD')
              } else {
                return this.formatDate(type, time)
              }
            }
          })(type, time)}
        </span>
        <DatePicker
          value={time}
          isOpen={isOpen}
          onSelect={this.handleSelect}
          onCancel={this.handleCancel}
          max={new Date()}
          dateConfig={isDate ? this.dateConfig : this.typeCofing}
          headerFormat={isDate ? 'YYYY年MM月DD日' : 'hh:mm:ss'}
          theme="ios"
        />
      </div>
    )
  }
}

ReactDatePicker.propTypes = {
  placeholder: PropTypes.string,
  handleDateSelected: PropTypes.func.isRequired,
  type: PropTypes.string
}

export default ReactDatePicker
