import { Picker, Popup } from 'src/app/components/spring-picker/index.jsx'
import PropTypes from 'prop-types'

import BraSize from './utils/brasize.json'
import CupSize from './utils/cupsize.json'

import WithHandleTouch from 'src/app/components/HOC/with_handletouch'

import 'src/app/components/spring-picker/style.css'
import './index.scss'

class MeasurementPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      brasize: {
        list: BraSize,
        defaultValue: props.defaultValue[0],
        displayValue: name => name
      },
      cupsize: {
        list: CupSize,
        defaultValue: props.defaultValue[1],
        displayValue: name => name
      }
    }
    this.brasize = null
    this.cupsize = null
  }

  handleConfirm = () => {
    this.setState(
      {
        brasize: {
          list: BraSize,
          defaultValue: this.brasize,
          displayValue: name => name
        },
        cupsize: {
          list: CupSize,
          defaultValue: this.cupsize,
          displayValue: name => name
        }
      },
      () => {
        this.props.onConfirm(this.brasize, this.cupsize)
      }
    )
  }

  handleCancel = () => this.props.onCancel && this.props.onCancel()

  changeSelectBra = value => (this.brasize = value)

  changeSelectCup = value => (this.cupsize = value)

  handleClickModal = () =>
    this.props.handleClickModal && this.props.handleClickModal()

  render() {
    return (
      <div className="ui-picker-Measurement" onClick={this.handleClickModal}>
        <Popup
          onConfirm={this.handleConfirm}
          onCancel={this.handleCancel}
          visible={this.props.visible}
        >
          <Picker
            onChange={_.debounce(this.changeSelectBra, 100, {
              leading: true
            })}
            data={this.state.brasize}
          />
          <Picker
            onChange={_.debounce(this.changeSelectCup, 100, {
              leading: true
            })}
            data={this.state.cupsize}
          />
        </Popup>
      </div>
    )
  }
}

MeasurementPicker.propTypes = {
  defaultValue: PropTypes.array.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired
}

MeasurementPicker.defaultProps = {
  defaultValue: [75, 'B'],
  onConfirm: () => {},
  onCancel: () => {},
  onChange: () => {},
  visible: false
}

export default WithHandleTouch(MeasurementPicker)
