import './index.scss'
import PropTypes from 'prop-types'

class TextInput extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { content: props.defaultValue }
  }

  onChangeInput = e => {
    const { activeKey, onChange, maxLength } = this.props

    const content = e.target.value
    if (content.length > maxLength) {
      return
    }
    this.setState({ content })

    onChange && onChange(content, activeKey)
  }

  clearInput = () => {
    const { onChange, activeKey } = this.props
    this.setState({ content: '' })
    onChange('', activeKey)
  }

  render() {
    const { content } = this.state
    const { placeholder, title } = this.props
    return (
      <div className="text-input">
        {title ? <p className="text-title">{title}</p> : null}
        <div className="input-box">
          <input
            className="input-container"
            type="text"
            placeholder={placeholder}
            value={content}
            onChange={this.onChangeInput}
          />
          {content ? (
            <div className="clear-text" onClick={this.clearInput} />
          ) : null}
        </div>
      </div>
    )
  }
}

TextInput.propTypes = {
  onChange: PropTypes.func.isRequired
}

TextInput.defaultProps = {
  defaultValue: '',
  placeholder: '请输入',
  title: '',
  maxLength: 15
}

export default TextInput
