import './index.scss'
import PropTypes from 'prop-types'
class SelectInput extends React.PureComponent {
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
    const { placeholder, options, title, unit } = this.props
    return (
      <div className="select-input">
        {!_.isEmpty(title) && <p className="select-title">{title}</p>}
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

SelectInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
}

SelectInput.defaultProps = {
  defaultValue: '',
  placeholder: '请输入',
  title: ''
}

export default SelectInput
