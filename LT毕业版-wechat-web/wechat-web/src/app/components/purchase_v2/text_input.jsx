import 'src/assets/stylesheets/components/purchase_v2/text_input.scss'
import PropTypes from 'prop-types'

const classNameForIsValid = (value, validator, showSuccess) => {
  if (value.length > 0) {
    if (!validator(value)) return 'invalid'
    if (showSuccess) return 'valid'
  }
  return ''
}

const TextInput = ({
  className,
  errorText,
  name,
  onChange,
  clearInput,
  placeholder,
  showSuccess,
  type,
  validator,
  value
}) => {
  const status = classNameForIsValid(value, validator, showSuccess)

  return (
    <div className={`text-input-component ${className}`}>
      <label htmlFor={name} className={`text-input ${name} ${status}`}>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        <span className="helper-text">{placeholder}</span>
        <span className="error-text">{errorText}</span>
        {value.length !== 0 && clearInput && (
          <span className="clear-text" onClick={clearInput} />
        )}
      </label>
    </div>
  )
}

TextInput.propTypes = {
  className: PropTypes.string,
  errorText: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  showSuccess: PropTypes.bool,
  type: PropTypes.oneOf([
    'button',
    'checkbox',
    'color',
    'date',
    'datetime-local',
    'email',
    'file',
    'hidden',
    'image',
    'month',
    'number',
    'password',
    'text'
  ]),
  validator: PropTypes.func,
  value: PropTypes.string.isRequired
}

TextInput.defaultProps = {
  className: '',
  errorText: 'invalid',
  name: '',
  placeholder: '',
  showSuccess: false,
  type: 'text',
  validator: () => true
}

export default TextInput
