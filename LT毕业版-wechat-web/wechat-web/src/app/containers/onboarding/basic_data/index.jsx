import Header from 'src/app/containers/onboarding/utils_component/data_title'
import TextInput from 'src/app/containers/onboarding/utils_component/text_input'
import DateSelector from 'src/app/containers/onboarding/utils_component/birthday_input'
import CityInput from 'src/app/containers/onboarding/utils_component/city_input'
import Selector from 'src/app/containers/onboarding/utils_component/select_input/new_select'
import ActionButtons from 'src/app/containers/onboarding/utils_component/new_bottom_buttons'

import Actions from 'src/app/actions/actions'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'

import { INDUSTRY, MARRIAGE } from './utils'
import '../index.scss'

class BasicDataContainer extends React.Component {
  constructor(props) {
    super(props)
    const { nickname, style, shipping_address } = props.customer
    const { birthday, occupation, mom, marital_status } = style

    const submitData = { mom, marital_status, birthday, occupation }

    const province = shipping_address ? shipping_address.state : ''
    const city = shipping_address ? shipping_address.city : ''

    this.state = {
      submitData,
      nickname,
      shipping_address,
      province,
      city,
      isSubmit: false
    }
  }

  handleMaritalStatus = () => {
    const { submitData } = this.state
    let status = ''
    _.findIndex(MARRIAGE, v => {
      const { mom, marital_status } = v.value
      if (
        mom === submitData.mom &&
        marital_status === submitData.marital_status
      ) {
        status = v.display
      }
    })
    return status
  }

  onChange = (info, activekey) => {
    const { submitData } = this.state
    submitData[activekey] = info
    this.setState({ submitData })
  }

  onChangeNickname = nickname => {
    this.setState({ nickname })
  }

  changeMarriage = marriage => {
    const { submitData } = this.state
    const newData = _.find(MARRIAGE, o => marriage === o.display)
    this.setState({ submitData: { ...submitData, ...newData.value } })
  }

  onSubmit = () => {
    if (this.isUnFinished()) {
      const { dispatch } = this.props
      const tip = { isShow: true, content: '请先填完基础档案信息' }
      dispatch(Actions.tips.changeTips(tip))
      return
    }
    this.setState({ isSubmit: true }, () => {
      this.updateNickname()
      this.updateCustomerInfo()
      this.updateShippingAddress()
    })
  }

  isUnFinished = () => {
    const { submitData, nickname, province, city } = this.state
    if (!nickname) return true
    if (!province || !city) return true

    const { occupation, marital_status, birthday } = submitData
    return !nickname || !birthday || !occupation || !marital_status
  }

  updateNickname = () => {
    const { nickname } = this.state
    const { dispatch } = this.props
    dispatch(Actions.customer.update({ nickname }, this.updateSuccess))
  }

  updateCustomerInfo = () => {
    this.props.dispatch(
      Actions.customerStyleInfo.updateUserDataAction({
        data: { style: this.state.submitData }
      })
    )
  }

  updateSuccess = () => {
    const { dispatch, onboarding } = this.props
    dispatch(
      Actions.currentCustomer.fetchMe(() => {
        const routeName = onboarding.routerList[1]
        browserHistory.push(`/get-started/${routeName}`)
      })
    )
  }

  updateStateAndCity = (province, city, zip_code) => {
    this.setState({ province, city, zip_code })
  }

  updateShippingAddress = () => {
    const { dispatch, style } = this.props
    const { province, city, zip_code } = this.state

    const shipping_address = {
      address_1: '',
      address_2: '',
      city: city,
      state: province,
      zip_code: zip_code ? zip_code : '518000',
      telephone: '',
      full_name: '',
      country: 'CN'
    }

    dispatch(
      Actions.updateShippingAddress({
        shipping_address,
        success: () => {
          if (style && style.top_size && style.dress_size) {
            dispatch(
              Actions.activeQueueProduct.activeQueueProduct({
                success: () => {}
              })
            )
          }
        }
      })
    )
  }

  render() {
    const { submitData, nickname, province, city, isSubmit } = this.state
    const { location } = this.props
    return (
      <div className="onboarding-box">
        <PageHelmet title={'个人风格档案'} link={location.pathname} />
        <Header status={0} />
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          <TextInput
            activeKey="nickname"
            title="如何称呼你"
            placeholder="请输入你的昵称"
            defaultValue={nickname || ''}
            onChange={this.onChangeNickname}
          />
          <DateSelector
            activeKey="birthday"
            title="你的生日"
            placeholder="请选择你的生日日期"
            defaultValue={submitData.birthday}
            onChange={this.onChange}
          />
          <Selector
            activeKey="occupation"
            title="所在行业"
            placeholder="请选择你的所在的行业"
            defaultValue={submitData.occupation || ''}
            options={INDUSTRY}
            onChange={this.onChange}
            touchHandler={false}
          />
          <CityInput
            isWechat
            province={province}
            city={city}
            updateStateAndCity={this.updateStateAndCity}
          />
          <Selector
            title="婚育状况"
            placeholder="请选择你的婚育状态"
            options={_.map(MARRIAGE, v => v.display)}
            onChange={this.changeMarriage}
            defaultValue={this.handleMaritalStatus()}
            touchHandler={false}
          />
        </div>
        <ActionButtons
          hiddenReturnButton
          isSubmit={isSubmit}
          onFinished={this.onSubmit}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    onboarding: state.onboarding || {},
    customer: state.customer || {}
  }
}

export default connect(mapStateToProps)(BasicDataContainer)
