import React, { Component } from 'react'
import CityPicker from 'src/app/components/CityPicker'
import wxInit from 'src/app/lib/wx_config.js'
import fetchJsonp from 'src/app/lib/jsonp.js'
import PROVINS from 'src/app/components/CityPicker/utils/provins.json'
import Actions from 'src/app/actions/actions'
import classnames from 'classnames'
import CITYS from 'src/app/components/CityPicker/utils/citys.json'
import { NextPage } from '../index'
import * as storage from 'src/app/lib/storage.js'
import './index.scss'
import {
  APPStatisticManager,
  ShenceStatisService
} from '../../../lib/statistics/app'

class SceneProblem extends Component {
  constructor(props) {
    super(props)
    this.provin_index = 0
    this.city_index = 0
    const { province, city, occupation } =
      JSON.parse(storage.get('cacheData7')) || {}
    this.state = {
      defaultValue: this.props.defaultValue || ['广东省', '深圳市'],
      isShow: false,
      province,
      city,
      occupation
    }
  }

  componentDidMount() {
    if (this.props.isWechat) {
      wxInit()
      setTimeout(() => {
        this.getLocation()
      }, 200)
    }
  }

  componentWillUnmount() {
    const { province, city, occupation } = this.state
    storage.set(
      'cacheData7',
      JSON.stringify({
        province,
        city,
        occupation
      })
    )
  }

  isValidCityInfo = () => Boolean(this.state.province && this.state.city)

  // num传入的数字，n需要的字符长度 不满补零
  prefixInteger = (num, n) => (Array(n).join(0) + num).slice(-n)

  handleCityConfirm = ({ province, city, provin_index, city_index }) => {
    this.provin_index = this.prefixInteger(provin_index, 2)
    this.city_index = this.prefixInteger(city_index, 4)
    this.setLocation(province, city)
  }

  getLocation = () =>
    wx.ready(() => {
      wx.getLocation({
        type: 'wgs84',
        success: res => {
          // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          const latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
          const longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
          this.getLoacitionInfo(latitude, longitude, this)
        },
        fail: () => wxInit(true, this.getLocation)
      })
    })

  getLoacitionInfo = (latitude, longitude) =>
    fetchJsonp(
      `https://api.map.baidu.com/geocoder/v2/?location=${latitude},${longitude}&output=json&pois=1&ak=9zXSsBhLWYFnepADRGCaGfwtAKDUYUXf`
    )
      .then(response => response.json())
      .then(json => {
        const addressComponent = json.result.addressComponent
        const province = addressComponent.province,
          city = addressComponent.city
        const isSupportThisProvince = PROVINS.indexOf(province) !== -1,
          isSupportThisCity =
            isSupportThisProvince && CITYS[province].indexOf(city) !== -1
        if (isSupportThisProvince && isSupportThisCity) {
          this.setState({
            defaultValue: [province, city],
            province: province,
            city: city
          })
          this.setLocation(province, city)
        }
      })
      .catch(error =>
        //TODO: 将来报到百度统计
        console.error(error)
      )

  onConfirm = (value, provin_index, city_index) => {
    this.setState({
      province: value[0],
      city: value[1],
      isShow: false
    })
    this.handleCityConfirm({
      province: value[0],
      city: value[1],
      provin_index: provin_index,
      city_index: city_index
    })
  }
  onCancel = () =>
    this.setState({
      isShow: false
    })
  onChange = value =>
    this.setState({
      province: value[0],
      city: value[1]
    })
  handleSelectCity = () => this.setState({ isShow: true })

  setLocation = (province, city) => {
    const isUnValidCity = !this.isValidCityInfo()
    if (isUnValidCity) {
      this.setState({
        province: province,
        city: city
      })
    }
  }

  handleSelectField = value => () =>
    this.setState({
      occupation: value
    })

  handleSceneSelect = (name_value, value) => () => {
    const {
      onboarding: {
        onboarding_questions: { question7 }
      },
      dispatch
    } = this.props
    const attribute_type = question7.value
    const answer = {
      attribute_type,
      name: name_value,
      value
    }
    dispatch(
      Actions.onboarding.setUserSelectAnwers({
        step: 'question7',
        answer
      })
    )
  }

  handleLocation = e => {
    e.stopPropagation()
    this.setState(state => {
      return {
        province: state.defaultValue[0],
        city: state.defaultValue[1]
      }
    })
  }

  handleNextPage = () => {
    const {
      onboardingNextStep,
      updateStyleInfo,
      dispatch,
      onboarding: { selectAnwers }
    } = this.props
    const { city, province, occupation } = this.state

    if (
      selectAnwers['question7'].length === 5 &&
      city &&
      province &&
      occupation
    ) {
      dispatch(Actions.onboarding.setOnboardingComplete('question7'))
      dispatch(
        Actions.updateShippingAddress({
          shipping_address: {
            address_1: '',
            address_2: '',
            city: city,
            state: province,
            zip_code: `99${this.provin_index}${this.city_index}`,
            telephone: '',
            full_name: '',
            country: 'CN'
          }
        })
      )
      updateStyleInfo(
        {
          occupation
        },
        onboardingNextStep
      )
      const content = {
        ob_city: city,
        ob_state: province,
        ob_occupation: occupation
      }
      APPStatisticManager.sensor(ShenceStatisService.id).setProfile(content)
    } else {
      onboardingNextStep()
    }
  }
  render() {
    const {
      onboarding: { onboarding_questions, selectAnwers }
    } = this.props
    const page = onboarding_questions.question7.pages[0],
      scenario_options = page.sub_questions.slice(3)
    const { province, city, defaultValue, occupation } = this.state
    return (
      <div className="scene-problem">
        <div className="step-title">{page.page_title}</div>
        <div className="the-same city">
          <span className="title">{page.sub_questions[0].tips}</span>
          <div
            className={classnames('city-info', {
              'weight-color': !!province
            })}
            onClick={this.handleSelectCity}
          >
            {province
              ? `${province}`
              : page.sub_questions[0].inputs[0].placeholder}
            &nbsp; &nbsp;{city ? city : null}
            <div className="location-img" onClick={this.handleLocation}>
              定位城市 <i className="location-icon" />
            </div>
          </div>
          <CityPicker
            defaultValue={defaultValue}
            province={province}
            city={city}
            onConfirm={this.onConfirm}
            onCancel={this.onCancel}
            onChange={this.onChange}
            visible={this.state.isShow}
          />
        </div>

        <div className="the-same industry-field">
          <div className="title">{page.sub_questions[1].tips}</div>
          {page.sub_questions[1].checkboxs.map(item => (
            <div
              key={item.value}
              className={classnames('field-item', {
                'bg-yellow': occupation === item.value
              })}
              onClick={this.handleSelectField(item.value)}
            >
              {item.tips}
            </div>
          ))}
        </div>
        <div className="the-same scenario">
          <div className="title">{page.sub_questions[2].tips}</div>
          <div className="scene-groups">
            {scenario_options.map(item => {
              return (
                <div className="group" key={item.value}>
                  <div className="group-title">{item.tips}</div>
                  {item.buttons.map(item_button => {
                    const currentName = _.find(selectAnwers['question7'], {
                      name: item.value
                    })
                    return (
                      <div
                        key={item_button.value}
                        className={classnames('scene-btn', {
                          'bg-yellow':
                            currentName &&
                            currentName.value === item_button.value
                        })}
                        onClick={this.handleSceneSelect(
                          item.value,
                          item_button.value
                        )}
                      >
                        {item_button.tips}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
        <NextPage onboardingNextStep={this.handleNextPage} />
      </div>
    )
  }
}

export default SceneProblem
