import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import PageHelmet from 'src/app/lib/pagehelmet'
import AddressInput from 'src/app/containers/address/components/input'
import AddressSelect from 'src/app/containers/address/components/address_select'
import Actions from 'src/app/actions/actions'
import { isValidTelephoneNum } from 'src/app/lib/validators'
import ZipCode from 'src/app/components/CityPicker/utils/zip_code.json'
import './index.scss'

function mapStateToProps(state) {
  const { customer, app } = state
  return {
    customer,
    app
  }
}

@connect(mapStateToProps)
export default class HomepageRouter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSubmiting: false
    }
    const { shipping_address } = props.customer
    this.formData = shipping_address ? { ...shipping_address } : {}
  }

  componentWillReceiveProps(nextProps) {
    if (_.isEmpty(this.formData)) {
      const { shipping_address } = nextProps.customer
      this.formData = shipping_address ? { ...shipping_address } : {}
    }
  }

  handleSubmit = () => {
    if (this.state.isSubmiting) {
      return null
    }
    const { shipping_address } = this.props.customer
    const state = this.formData.state || shipping_address.state
    const city = this.formData.city
    const district = this.formData.district
    const zip_code_key = `${state}${city}${district}`
    const zip_code = ZipCode[zip_code_key] || '000000'
    const addressInfo = {
      address_1: this.formData.address_1,
      address_2: '',
      city: this.formData.city,
      state,
      district,
      zip_code,
      telephone: this.formData.telephone,
      full_name: this.formData.full_name,
      country: 'CN'
    }
    if (this.isEmptyData(addressInfo)) {
      this.props.dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: `请填写完你的地址信息`
        })
      )
      return null
    }
    if (!isValidTelephoneNum(this.formData.telephone)) {
      this.props.dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: `你输入的手机号不正确！`
        })
      )
      return null
    }
    // NOTE：防止用户多次进入地址簿更新
    if (!_.isEmpty(shipping_address)) {
      const isChanged =
        shipping_address.address_1 !== addressInfo.address_1 ||
        shipping_address.state !== addressInfo.state ||
        shipping_address.city !== addressInfo.city ||
        shipping_address.district !== addressInfo.district ||
        shipping_address.telephone !== addressInfo.telephone ||
        shipping_address.full_name !== addressInfo.full_name ||
        shipping_address.zip_code !== addressInfo.zip_code
      if (!isChanged) {
        browserHistory.goBack()
        return null
      }
    }
    this.setState({
      isSubmiting: true
    })
    this.props.dispatch(
      Actions.updateShippingAddress({
        shipping_address: addressInfo,
        success: this.updateSuccess,
        error: this.updateError
      })
    )
  }

  updateSuccess = () => {
    browserHistory.goBack()
  }

  updateError = () => {
    this.setState({
      isSubmiting: false
    })
  }

  isEmptyData = address => {
    return (
      _.isEmpty(address.address_1) ||
      _.isEmpty(address.state) ||
      _.isEmpty(address.city) ||
      _.isEmpty(address.district) ||
      _.isEmpty(address.telephone) ||
      _.isEmpty(address.full_name) ||
      _.isEmpty(address.zip_code)
    )
  }

  changeFullName = full_name => (this.formData['full_name'] = full_name)

  changeTelephone = tel => (this.formData['telephone'] = tel)

  changeCity = info => (this.formData = { ...this.formData, ...info })

  changeAddress = address => (this.formData['address_1'] = address)

  render() {
    const isAddressEmpty = _.isEmpty(this.formData)
    const address = isAddressEmpty
      ? ['广东省', '深圳市', '南山区']
      : [this.formData.state, this.formData.city, this.formData.district]
    return (
      <div className="address-container">
        <PageHelmet
          title={isAddressEmpty ? '填写地址' : '修改地址'}
          link="/address"
        />
        <AddressInput
          title="收货人"
          maxLength="6"
          defaultValue={this.formData.full_name}
          onChange={this.changeFullName}
        />
        <AddressInput
          title="手机号码"
          type="tel"
          maxLength="11"
          onChange={this.changeTelephone}
          defaultValue={this.formData.telephone}
        />
        <AddressSelect
          title="所在地区"
          shipping_address={this.formData}
          defaultValue={address}
          onChange={this.changeCity}
        />
        <AddressInput
          title="详细地址"
          maxLength="100"
          onChange={this.changeAddress}
          defaultValue={this.formData.address_1}
          domType="textarea"
        />
        <span className="address-btn" onClick={this.handleSubmit}>
          确认{isAddressEmpty ? '' : '修改'}
        </span>
      </div>
    )
  }
}
