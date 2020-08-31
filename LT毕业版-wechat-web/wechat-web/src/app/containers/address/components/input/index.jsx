import './index.scss'

export default class AddressInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: props.defaultValue || ''
    }
    this.textarea = null
  }

  componentDidMount() {
    if (this.textarea) {
      this.textarea.innerText = this.state.inputValue
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      inputValue: nextProps.defaultValue || ''
    })
    if (this.textarea) {
      this.textarea.innerText = nextProps.defaultValue || ''
    }
  }

  handleChange = e => {
    const { value, innerText } = e.target
    const { domType } = this.props
    const text = _.isEmpty(innerText) ? null : innerText
    const newValue = domType === 'textarea' ? text : value
    this.setState({
      inputValue: newValue
    })
    this.props.onChange && this.props.onChange(newValue)
  }

  setCaretPosition = e => {
    // 将光标移动到最后
    const dom = e.target
    dom.focus()
    const { domType } = this.props
    const len = domType === 'textarea' ? dom.innerHTML.length : dom.value.length
    if (document.selection) {
      const sel = dom.createTextRange()
      sel.moveStart('character', len)
      sel.collapse()
      sel.select()
    } else if (
      typeof dom.selectionStart === 'number' &&
      typeof dom.selectionEnd === 'number'
    ) {
      dom.selectionStart = dom.selectionEnd = len
    }
  }

  render() {
    const { inputValue } = this.state
    const { title, type, placeholder, maxLength, domType } = this.props
    return (
      <div className="address-input">
        <span className="title">{title}</span>
        {domType === 'textarea' ? (
          <div
            ref={refs => (this.textarea = refs)}
            contentEditable="true"
            className="input textarea"
            placeholder={placeholder}
            maxLength={maxLength}
            onInput={this.handleChange}
            onClick={this.setCaretPosition}
          />
        ) : (
          <input
            className="input"
            type={type}
            value={inputValue}
            maxLength={maxLength}
            onChange={this.handleChange}
            onClick={this.setCaretPosition}
            placeholder={placeholder}
          />
        )}
      </div>
    )
  }
}

AddressInput.defaultProps = {
  type: 'text',
  defaultValue: '',
  placeholder: '请填写',
  title: '',
  maxLength: 15
}
