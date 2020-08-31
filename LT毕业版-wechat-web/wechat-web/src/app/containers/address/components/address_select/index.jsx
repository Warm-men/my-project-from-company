import CompleteCity from 'src/app/components/CityPicker/complete_city.jsx'
import next from 'src/assets/images/account/next.png'
import './index.scss'

export default class AddressSelect extends React.Component {
  constructor(props) {
    super(props)
    const { shipping_address, defaultValue } = props
    this.state = {
      inputValue: defaultValue,
      isShow: false,
      province: shipping_address ? shipping_address.state : '',
      city: shipping_address ? shipping_address.city : '',
      areas: shipping_address ? shipping_address.district : ''
    }
  }

  componentWillReceiveProps(nextProps) {
    const { shipping_address, defaultValue } = nextProps
    this.setState({
      inputValue: defaultValue,
      province: shipping_address ? shipping_address.state : '',
      city: shipping_address ? shipping_address.city : '',
      areas: shipping_address ? shipping_address.district : ''
    })
  }

  handleChange = e => {
    const { value } = e.target
    this.setState({
      inputValue: value
    })
    this.props.onChange && this.props.onChange(value)
  }

  showSelect = () => {
    this.setState({
      isShow: true
    })
  }

  // num传入的数字，n需要的字符长度 不满补零
  prefixInteger = (num, n) => (Array(n).join(0) + num).slice(-n)

  onConfirm = value => {
    this.setState({
      province: value[0],
      city: value[1],
      areas: value[2],
      isShow: false
    })
    const info = {
      state: value[0],
      city: value[1],
      district: value[2]
    }
    this.props.onChange && this.props.onChange(info)
  }

  onCancel = () => {
    this.setState({
      isShow: false
    })
  }

  isShowInfo = () => {
    const { shipping_address } = this.props
    const { province, city, areas } = this.state
    return (
      !_.isEmpty(shipping_address) &&
      !_.isEmpty(areas) &&
      !_.isEmpty(province) &&
      !_.isEmpty(city)
    )
  }

  render() {
    const { inputValue, province, city, areas } = this.state
    const isShowInfo = this.isShowInfo()
    return (
      <div className="address-select">
        <span className="title">{this.props.title}</span>
        <span
          className={isShowInfo ? 'input' : 'input placeholder'}
          onClick={this.showSelect}
        >
          {isShowInfo ? `${province} ${city} ${areas}` : `请填写`}
          <img className="icon" src={next} alt="" />
        </span>
        <CompleteCity
          defaultValue={inputValue}
          province={province}
          city={city}
          areas={areas}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
          visible={this.state.isShow}
        />
      </div>
    )
  }
}

AddressSelect.defaultProps = {
  type: 'text',
  placeholder: '请填写',
  title: '',
  maxLength: 15
}
