import PropTypes from 'prop-types'
import './index.scss'

const Option = ({ value, formatter }) => {
  let displayValue = value
  if (formatter) displayValue = formatter(value)
  return <option value={value}>{displayValue}</option>
}

Option.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  formatter: PropTypes.func
}

Option.defaultProps = {
  formatter: null
}

const OptionSelect = ({ name, value, onChange, options, optionFormatter }) => (
  <select
    name={name}
    className="option-select"
    value={value}
    onChange={onChange}
  >
    <option value={name.split('_').join(' ')} className="hide" disabled>
      {name.split('_').join(' ')}
    </option>
    {options &&
      options.map(option => (
        <Option key={option} value={option} formatter={optionFormatter} />
      ))}
  </select>
)

OptionSelect.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  optionFormatter: PropTypes.func
}

OptionSelect.defaultProps = {
  value: '',
  onChange: () => null,
  optionFormatter: null
}

export default OptionSelect
