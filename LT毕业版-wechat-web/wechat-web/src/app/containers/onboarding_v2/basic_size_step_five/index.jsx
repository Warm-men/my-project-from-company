import React, { Component } from 'react'
import SelectPickerV2 from '../select_picker_v2'
import MeasurementPicker from 'src/app/components/MeasurementPicker'
import classnames from 'classnames'
import Actions from 'src/app/actions/actions'
import { NextPage } from '../index'
import * as storage from 'src/app/lib/storage.js'
import {
  NAME_MAPPING,
  FULL_DRESS_SIZE,
  FULL_PANT_SIZE
} from 'src/app/containers/onboarding/size.js'
import { calJeanSize, calculateSize } from 'src/app/lib/calculate_size.js'
import Hint from 'src/app/components/hint'
import './index.scss'
import {
  APPStatisticManager,
  ShenceStatisService
} from '../../../lib/statistics/app'

const MAX_HEIGHT = 190
const MIN_HEIGHT = 150
const MAX_WEIGHT = 80
const MIN_WEIGHT = 40

class BasicSize extends Component {
  constructor(props) {
    super(props)
    const { height_inches, weight, bra_size, cup_size } =
      JSON.parse(storage.get('page0Cache')) || {}
    this.state = {
      submitData: {
        height_inches,
        weight,
        bra_size,
        cup_size,
        top_size: '',
        pant_size: '',
        dress_size: '',
        skirt_size: '',
        jean_size: ''
      },
      isShow: false,
      isShowHint: false,
      isConfirm: false
    }
  }
  componentWillUnmount() {
    const { height_inches, weight, bra_size, cup_size } = this.state.submitData
    const page0Cache = {
      height_inches,
      weight,
      bra_size,
      cup_size
    }
    storage.set('page0Cache', JSON.stringify(page0Cache))
    this.props.dispatch(Actions.onboarding.stepFiveAddAPage(1))
  }

  renderListItems = (min, max) => {
    let items = []
    for (let i = min; i <= max; i++) {
      items.push(i)
    }
    return items
  }

  handleShowPicker = () => {
    this.setState({
      isShow: true
    })
  }

  changeUserInfo = (value, type) => {
    let submitData = this.state.submitData
    submitData[type] = value
    this.setState({ submitData }, this.setPageoneCallback)
  }

  handleBreathConfirm = (brasize, cupsize) => {
    let { submitData } = this.state
    submitData['bra_size'] = brasize
    submitData['cup_size'] = cupsize
    this.setState(
      {
        submitData: submitData,
        isShow: false
      },
      this.setPageoneCallback
    )
  }

  handleBreathCancel = () => {
    this.setState({
      isShow: false
    })
  }

  setPageoneCallback = () => {
    const { height_inches, weight, bra_size, cup_size } = this.state.submitData
    if (!!height_inches && !!weight && !!bra_size && !!cup_size) {
      this.props.dispatch(Actions.onboarding.setOnboardingComplete('question5'))
    }
  }

  setPagetwoCallback = () => {
    const {
      top_size,
      pant_size,
      dress_size,
      skirt_size,
      jean_size
    } = this.state.submitData
    if (
      !!top_size &&
      !!pant_size &&
      !!dress_size &&
      !!skirt_size &&
      !!jean_size
    ) {
      this.props.dispatch(Actions.onboarding.setOnboardingComplete('question5'))
    }
  }

  handleSizeSelect = (value, mainValue) => () => {
    const submitData = this.state.submitData
    submitData[NAME_MAPPING[mainValue]] = value
    this.setState(
      {
        submitData
      },
      this.setPagetwoCallback
    )
  }

  validHandle = () => {
    const {
      onboarding: { firstToteStepFivePage }
    } = this.props
    const { isConfirm, submitData } = this.state
    if (
      !isConfirm &&
      firstToteStepFivePage !== 1 &&
      _.isEqual(this.initData, submitData)
    ) {
      this.setState({ isShowHint: true })
      return null
    }
    this.handleNextPage()
  }

  handleNextPage = () => {
    const {
      onboardingNextStep,
      onboarding: { firstToteStepFivePage },
      customer: {
        style: { waist_size }
      }
    } = this.props
    const {
      height_inches,
      weight,
      bra_size,
      cup_size,
      top_size,
      pant_size,
      dress_size,
      skirt_size,
      jean_size
    } = this.state.submitData
    const page0 = {
      height_inches,
      weight,
      bra_size,
      cup_size
    }
    const page1 = {
      top_size,
      pant_size,
      dress_size,
      skirt_size,
      jean_size
    }
    const defaultCalulate = calculateSize(height_inches, weight)
    if (firstToteStepFivePage === 1 && defaultCalulate) {
      const data = {
        ...this.state.submitData,
        top_size: top_size || defaultCalulate,
        pant_size: pant_size || FULL_PANT_SIZE[defaultCalulate],
        dress_size: dress_size || FULL_DRESS_SIZE[defaultCalulate],
        skirt_size: skirt_size || FULL_DRESS_SIZE[defaultCalulate],
        jean_size: jean_size || calJeanSize(height_inches, weight, waist_size)
      }
      this.initData = { ...data }
      this.setState({
        submitData: data
      })
    }
    const style = firstToteStepFivePage === 1 ? page0 : page1
    const content = {
      ob_height: height_inches,
      ob_weight: weight,
      ob_bra_size: bra_size,
      ob_cup_size: cup_size,
      ob_dress_size: dress_size,
      ob_jean_size: jean_size,
      ob_pant_size: pant_size,
      ob_skirt_size: skirt_size,
      ob_top_size: top_size
    }
    APPStatisticManager.sensor(ShenceStatisService.id).setProfile(content)
    this.props.updateStyleInfo(style, onboardingNextStep)
  }

  hideHint = () => this.setState({ isShowHint: false })

  handleConfirm = () => this.setState({ isConfirm: true, isShowHint: false })

  render() {
    const {
      onboarding: { onboarding_questions, firstToteStepFivePage }
    } = this.props
    const page0 = onboarding_questions.question5.pages[0],
      sub_questions0 = page0.sub_questions
    const page1 = onboarding_questions.question5.pages[1],
      sub_questions1 = page1.sub_questions
    const {
      submitData: { height_inches, weight, bra_size, cup_size }
    } = this.state
    const braSize = !bra_size ? 75 : bra_size,
      cupSize = _.isEmpty(cup_size) ? 'B' : cup_size
    return (
      <div className="basic-size">
        {firstToteStepFivePage === 1 && (
          <div className="page0">
            <div className="step-title">{page0.page_title}</div>
            <SelectPickerV2
              activeKey="height_inches"
              title={sub_questions0[0].tips}
              placeholder={sub_questions0[0].inputs[0].placeholder}
              defaultValue={height_inches || ''}
              options={this.renderListItems(MIN_HEIGHT, MAX_HEIGHT)}
              unit={sub_questions0[0].inputs[0].tips}
              onChange={this.changeUserInfo}
            />
            <SelectPickerV2
              activeKey="weight"
              title={sub_questions0[1].tips}
              placeholder={sub_questions0[1].inputs[0].placeholder}
              defaultValue={weight || ''}
              options={this.renderListItems(MIN_WEIGHT, MAX_WEIGHT)}
              unit={sub_questions0[1].inputs[0].tips}
              onChange={this.changeUserInfo}
            />
            <div className="select-input-v2">
              <p className="select-title-v2">{sub_questions0[2].tips}</p>
              <span
                className={classnames('select-container-v2', 'clear-margin', {
                  fcolor: !!bra_size
                })}
                onClick={this.handleShowPicker}
              >
                {`${
                  !bra_size || !cup_size
                    ? sub_questions0[2].inputs[0].placeholder
                    : `${bra_size} ${cup_size}`
                }`}
              </span>
            </div>
            <MeasurementPicker
              defaultValue={[braSize, cupSize]}
              onConfirm={this.handleBreathConfirm}
              onCancel={this.handleBreathCancel}
              visible={this.state.isShow}
            />
          </div>
        )}
        {firstToteStepFivePage === 2 && (
          <div className="page1">
            <div className="step-title">{page1.page_title}</div>
            {sub_questions1.map((item, index) => (
              <div className="size-groups" key={item.value}>
                <div className="title">{item.tips}</div>
                {sub_questions1[index].buttons.map(item_butions => (
                  <span
                    className={classnames('size-button', {
                      'bg-yellow':
                        this.state.submitData[NAME_MAPPING[item.value]] ===
                        item_butions.value
                    })}
                    key={item_butions.value}
                    onClick={this.handleSizeSelect(
                      item_butions.value,
                      item.value
                    )}
                  >
                    {item_butions.tips}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
        {this.state.isShowHint && (
          <Hint
            title=""
            textAlign="center"
            content="常穿尺码都正确吗？"
            leftBtnText="我再看看"
            rightBtnText="是的"
            leftButton={this.hideHint}
            rightButton={this.handleNextPage}
            setAllButtonsRed
          />
        )}
        <NextPage onboardingNextStep={this.validHandle} />
      </div>
    )
  }
}

export default BasicSize
