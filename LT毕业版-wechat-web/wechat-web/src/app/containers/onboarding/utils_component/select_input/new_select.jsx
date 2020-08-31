import { Picker, Popup } from 'src/app/components/spring-picker/index.jsx'
import PropTypes from 'prop-types'
import WithHandleTouch from 'src/app/components/HOC/with_handletouch'
import 'src/app/components/spring-picker/style.css'
import './index.scss'

class NewSelector extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: props.defaultValue,
      visible: false,
      options: {
        list: props.options,
        defaultValue: props.defaultValue || props.options[0],
        displayValue: name => name
      }
    }
    this.selectValue = null
  }

  changeInput = value => {
    this.selectValue = value
  }

  handleConfirm = () => {
    const { onChange, activeKey } = this.props
    this.setState({ inputValue: this.selectValue, visible: false })
    onChange && onChange(this.selectValue, activeKey)
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  handleShowPicker = () => {
    this.setState({ visible: true })
  }

  render() {
    const { inputValue, visible } = this.state
    const { placeholder, title, unit } = this.props
    return (
      <div className="new-selector">
        <div className="select-input">
          <p className="select-title">{title}</p>
          {inputValue ? (
            <span
              className={`new-selector-container ${unit ? 'hidden-icon' : ''}`}
              onClick={this.handleShowPicker}
            >
              {inputValue}
            </span>
          ) : (
            <span
              className={`new-selector-container placeholder ${
                unit ? 'hidden-icon' : ''
              }`}
              onClick={this.handleShowPicker}
            >
              {placeholder}
            </span>
          )}
          {unit ? <span className="unit">{unit}</span> : null}
        </div>
        <div className="ui-picker-newselect" onClick={this.handleClickModal}>
          <Popup
            onConfirm={this.handleConfirm}
            onCancel={this.handleCancel}
            visible={visible}
          >
            <Picker
              onChange={_.debounce(this.changeInput, 100, { leading: true })}
              data={this.state.options}
            />
          </Popup>
        </div>
      </div>
    )
  }
}

NewSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
}

NewSelector.defaultProps = {
  defaultValue: '',
  placeholder: '请输入',
  title: ''
}

const EnhancedSelector = WithHandleTouch(NewSelector)

export default class NewSelectorQuery extends React.PureComponent {
  render() {
    return this.props.touchHandler ? (
      <EnhancedSelector {...this.props} />
    ) : (
      <NewSelector {...this.props} />
    )
  }
}

NewSelectorQuery.propTypes = {
  touchHandler: PropTypes.bool
}
NewSelectorQuery.defaultProps = {
  touchHandler: true
}
