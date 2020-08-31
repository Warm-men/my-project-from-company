import { Picker, Popup } from 'src/app/components/spring-picker/index.jsx'
import PropTypes from 'prop-types'
import provins from './utils/provins.json'
import citys from './utils/citys.json'
import 'src/app/components/spring-picker/style.css'
import './index.scss'
import WithHandleTouch from 'src/app/components/HOC/with_handletouch'
class CityPicker extends React.Component {
  constructor(props) {
    super(props)
    this.address = []
    this.provin_index = 0
    this.city_index = 0
    this.state = {
      provins: {
        list: provins,
        defaultValue: props.defaultValue[0],
        displayValue: name => {
          return name
        }
      },
      citys: {
        list: citys[props.defaultValue[0]],
        defaultValue: props.defaultValue[1],
        displayValue: name => {
          return name
        }
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.setState(state => ({
        provins: {
          ...state.provins,
          defaultValue: nextProps.defaultValue[0]
        },
        citys: {
          ...state.citys,
          list: citys[nextProps.defaultValue[0]],
          defaultValue: nextProps.defaultValue[1]
        }
      }))
    }
  }

  handleChangeProvin = provin => {
    this.setState(state => ({
      provins: {
        ...state.provins,
        list: provins,
        defaultValue: provin
      },
      citys: {
        ...state.citys,
        list: citys[provin],
        defaultValue:
          provin === this.state.provins.defaultValue
            ? this.state.citys.defaultValue
            : citys[provin][0]
      }
      // areas: {
      //   ...state.areas,
      //   list: areas[citys[provin][0]],
      //   defaultValue: areas[citys[provin][0]][0]
      // }
    }))
    this.provin_index = provins.indexOf(provin)
    this.address = []
    this.address.push(provin)
    this.address.push(citys[provin][0])
    // this.address.push(areas[citys[provin][0]][0])
    this.props.onChange(this.address)
  }

  handleChangeCity = city => {
    this.address[1] = city
    this.city_index = citys[this.address[0]].indexOf(city)
    // this.address[2] = areas[city][0]
    // this.setState(state => ({
    //   areas: {
    //     ...state.areas,
    //     list: areas[city],
    //     defaultValue: areas[city][0]
    //   }
    // }))
    this.setState(state => ({
      citys: {
        ...state.citys,
        defaultValue: city
      }
    }))
    this.props.onChange(this.address)
  }

  // handleChangeArea = area => {
  //   this.address[2] = area
  //   this.props.onChange(this.address)
  // }

  handleClose = () => {
    this.props.onConfirm(this.address, this.provin_index, this.city_index)
  }

  handleCancel = () => {
    this.props.onCancel()
  }

  render() {
    return (
      <div className="ui-picker-address">
        <Popup
          onConfirm={this.handleClose}
          onCancel={this.handleCancel}
          visible={this.props.visible}
        >
          <Picker
            onChange={_.debounce(this.handleChangeProvin, 100, {
              leading: true
            })}
            data={this.state.provins}
          />
          <Picker
            onChange={_.debounce(this.handleChangeCity, 100, {
              leading: true
            })}
            data={this.state.citys}
          />
          {/* <Picker onChange={this.handleChangeArea} data={this.state.areas} /> */}
        </Popup>
      </div>
    )
  }
}

CityPicker.propTypes = {
  defaultValue: PropTypes.array.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired
}

CityPicker.defaultProps = {
  defaultValue: ['广东省', '深圳市'],
  onConfirm: () => {},
  onCancel: () => {},
  onChange: () => {},
  visible: false
}

export default WithHandleTouch(CityPicker)
