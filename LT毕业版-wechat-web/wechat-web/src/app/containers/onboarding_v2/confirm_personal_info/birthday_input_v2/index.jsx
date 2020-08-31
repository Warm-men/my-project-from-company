import PropTypes from 'prop-types'
import ReactDatePicker from 'src/app/components/ReactDatePicker'
import { format } from 'date-fns'
import './index.scss'

class BirthdayInput extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: props.defaultValue
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      inputValue: nextProps.defaultValue
    })
  }

  handleSelectDate = date => {
    const validDate = date
    const { activeKey, onChange } = this.props
    onChange(validDate, activeKey)
  }

  getSelectDate = () => {
    const birthday = this.state.inputValue
      ? format(new Date(this.state.inputValue))
      : new Date('1990-01-01')
    return new Date(birthday)
  }

  render() {
    const { placeholder, title, defaultValue } = this.props
    const picker = defaultValue
      ? {
          defaultDate: this.getSelectDate()
        }
      : {}
    return (
      <div className="brithday-input-v2">
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
