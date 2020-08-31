import { Picker, Popup } from 'src/app/components/spring-picker/index.jsx'
import PropTypes from 'prop-types'
import WithHandleTouch from 'src/app/components/HOC/with_handletouch'
import classnames from 'classnames'
import 'src/app/components/spring-picker/style.css'
import './index.scss'

class SelectPickerV2 extends React.PureComponent {
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
    this.setState({
      inputValue: this.selectValue,
      visible: false
    })
    onChange && onChange(this.selectValue, activeKey)
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  handleShowPicker = () => {
    this.setState({
      visible: true
    })
  }

  render() {
    const { inputValue, visible } = this.state
    const { placeholder, title, unit } = this.props
    return (
      <div className="select-picker-v2">
        <div className="select-input-v2">
          <p className="select-title-v2">{title}</p>
          <span
            className={classnames('select-container-v2', 'clear-margin', {
              fcolor: !!inputValue
            })}
            onClick={this.handleShowPicker}
          >
            {inputValue ? inputValue : placeholder}{' '}
            <span className="unit">{unit}</span>
          </span>
        </div>
        <div className="ui-picker-newselect" onClick={this.handleClickModal}>
          <Popup
            onConfirm={this.handleConfirm}
            onCancel={this.handleCancel}
            visible={visible}
          >
            <Picker
              onChange={_.debounce(this.changeInput, 100, {
                leading: true
              })}
              data={this.state.options}
            />
          </Popup>
        </div>
      </div>
    )
  }
}

SelectPickerV2.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired
}

SelectPickerV2.defaultProps = {
  defaultValue: '',
  placeholder: '请输入',
  title: ''
}

export default WithHandleTouch(SelectPickerV2)
