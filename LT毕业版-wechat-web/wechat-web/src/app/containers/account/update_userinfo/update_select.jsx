import './index.scss'
import PropTypes from 'prop-types'
import deviceType from 'src/app/lib/device_type'

class UpdateSelectInput extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: props.defaultValue
    }
  }

  changeInput = e => {
    const { onChange, activeKey } = this.props
    this.setState({
      inputValue: e.currentTarget.value
    })
    onChange(e.target.value, activeKey)
  }

  render() {
    const { inputValue } = this.state
    const { placeholder, options, unit } = this.props
    return (
      <div
        className={
          deviceType().isiOS ? 'update-select-box is-ios' : 'update-select-box'
        }
      >
        <select
          className="select-container"
          onChange={this.changeInput}
          value={inputValue}
        >
          <option className="hide" value={placeholder}>
            {placeholder}
          </option>
          {_.map(options, (option, index) => (
            <option key={index} value={option}>
              {`${option}${unit ? unit : ''}`}
            </option>
          ))}
        </select>
      </div>
    )
  }
}

UpdateSelectInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
}

UpdateSelectInput.defaultProps = {
  defalutValue: '',
  placeholder: '未填写'
}

export default UpdateSelectInput
