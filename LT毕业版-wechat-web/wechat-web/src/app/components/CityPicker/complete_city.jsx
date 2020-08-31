import { Picker, Popup } from 'src/app/components/spring-picker/index.jsx'
import PropTypes from 'prop-types'
import provins from './utils/provins.json'
import citys from './utils/citys.json'
import district from './utils/district.json'
import WithHandleTouch from 'src/app/components/HOC/with_handletouch'
import 'src/app/components/spring-picker/style.css'
import './index.scss'

class CompleteCity extends React.Component {
  constructor(props) {
    super(props)
    this.address = []
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
      },
      areas: {
        list: this.getAppDistrict(props.defaultValue[0], props.defaultValue[1]),
        defaultValue: props.defaultValue[2],
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

  getAppDistrict = (province, city) => {
    // NOTE:兼容App的地址信息数据结构(3716行不方便源文件调整)，先完成功能，如有卡顿等后续考虑后化
    let newDistrict = []
    _.map(district, provinceList => {
      _.map(provinceList, (cityList, cityKey) => {
        if (_.includes(province, cityKey)) {
          _.map(cityList, areas => {
            _.find(areas, (v, k) => {
              newDistrict = _.includes(city, k) ? areas[k] : newDistrict
            })
          })
        }
      })
    })
    return newDistrict
  }

  handleChangeProvin = provin => {
    const areas = this.getAppDistrict(provin, citys[provin][0])
    const cityDefault =
      provin === this.state.provins.defaultValue
        ? this.state.citys.defaultValue
        : citys[provin][0]
    const areasDefault =
      cityDefault === this.state.citys.defaultValue
        ? this.state.areas.defaultValue
        : areas[0]
    this.setState(state => ({
      provins: {
        ...state.provins,
        list: provins,
        defaultValue: provin
      },
      citys: {
        ...state.citys,
        list: citys[provin],
        defaultValue: cityDefault
      },
      areas: {
        ...state.areas,
        list: areas,
        defaultValue: areasDefault
      }
    }))
    this.address = []
    this.address.push(provin)
    this.address.push(citys[provin][0])
    this.address.push(areas[0])
    this.props.onChange(this.address)
  }

  handleChangeCity = city => {
    this.address[1] = city
    const areas = this.getAppDistrict(this.address[0], city)
    const areasDefault =
      city === this.state.citys.defaultValue
        ? this.state.areas.defaultValue
        : areas[0]
    this.address[2] = areasDefault
    this.setState(state => ({
      areas: {
        ...state.areas,
        list: areas,
        defaultValue: areasDefault
      },
      citys: {
        ...state.citys,
        defaultValue: city
      }
    }))
    this.props.onChange(this.address)
  }

  handleChangeArea = area => {
    this.address[2] = area
    this.props.onChange(this.address)
  }

  handleClose = () => {
    this.props.onConfirm(this.address)
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
          <Picker
            onChange={_.debounce(this.handleChangeArea, 100, {
              leading: true
            })}
            data={this.state.areas}
          />
        </Popup>
      </div>
    )
  }
}

CompleteCity.propTypes = {
  defaultValue: PropTypes.array.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired
}

CompleteCity.defaultProps = {
  defaultValue: ['广东省', '深圳市', '南山区'],
  onConfirm: () => {},
  onCancel: () => {},
  onChange: () => {},
  visible: false
}

export default WithHandleTouch(CompleteCity)
