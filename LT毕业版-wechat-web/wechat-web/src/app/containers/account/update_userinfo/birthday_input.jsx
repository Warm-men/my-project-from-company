import './index.scss'
import PropTypes from 'prop-types'
import ReactDatePicker from 'src/app/components/ReactDatePicker/index'
import { format } from 'date-fns'
class BirthdayInput extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: props.defalutValue
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      inputValue: nextProps.defalutValue
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
    const { placeholder, defalutValue, togglePicker } = this.props
    const picker = defalutValue
      ? {
          defaultDate: this.getSelectDate()
        }
      : {}
    return (
      <div className="update-brithday-input">
        <ReactDatePicker
          type="date"
          placeholder={placeholder}
          {...picker}
          togglePicker={togglePicker}
          handleDateSelected={this.handleSelectDate}
        />
      </div>
    )
  }
}

BirthdayInput.propTypes = {
  onChange: PropTypes.func.isRequired
}

BirthdayInput.defaultProps = {
  defalutValue: '',
  placeholder: '请输入',
  title: ''
}

export default BirthdayInput
