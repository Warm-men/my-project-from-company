import './index.scss'
import PropTypes from 'prop-types'
import ReactDatePicker from 'src/app/components/ReactDatePicker/index'
import { format } from 'date-fns'
class BirthdayInput extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { inputValue: props.defaultValue }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ inputValue: nextProps.defaultValue })
  }

  handleSelectDate = date => {
    const { activeKey, onChange } = this.props
    onChange(date, activeKey)
  }

  getPickerData = () => {
    const { defaultValue } = this.props
    const birthday = this.state.inputValue
      ? format(new Date(this.state.inputValue))
      : new Date('1990-01-01')

    return defaultValue ? { defaultDate: new Date(birthday) } : {}
  }

  render() {
    const { placeholder, title } = this.props
    const picker = this.getPickerData()

    return (
      <div className="brithday-input">
        <p className="brithday-title">{title}</p>
        <div className="input-brithday">
          <ReactDatePicker
            type="date"
            placeholder={placeholder}
            {...picker}
            handleDateSelected={this.handleSelectDate}
          />
        </div>
      </div>
    )
  }
}

BirthdayInput.propTypes = {
  onChange: PropTypes.func.isRequired
}

BirthdayInput.defaultProps = {
  defaultValue: '',
  placeholder: '请输入',
  title: ''
}

export default BirthdayInput
