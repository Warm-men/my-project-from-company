import React, { Component } from 'react'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions.js'
import ActionButton from 'src/app/components/shared/action_button/index.jsx'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import PageHelmet from 'src/app/lib/pagehelmet'
import { bustSizeComputed } from 'src/app/lib/calculate_size.js'
import { SELECT_SIZE_OPIONS } from '../utils'
import SwiperSizeSelect from './swiper-size-select'
import './index.scss'

const getState = state => ({
  style: state.customer.style
})

@connect(getState)
export default class SelectSize extends Component {
  constructor(props) {
    super(props)
    this.size_option = _.find(SELECT_SIZE_OPIONS, { type: props.params.type })
    this.state = {
      value: props.style[this.size_option.type],
      maxValue: null,
      minValue: null,
      showSizePredict: false,
      hasSizePredict: false
    }
    this.sizePredictType = null
    this.scrollNum = 0
    this.pickerDom = React.createRef()
  }

  componentDidMount() {
    this.fetchSizePredict()
  }

  fetchSizePredict = () => {
    const pathname = this.checkPathname()
    let currentAction
    if (pathname === 'bust_size_number') {
      this.sizePredictType = 'bust_predict'
      currentAction = Actions.sizePredict.fetchBustPredict
    } else if (pathname === 'waist_size') {
      this.sizePredictType = 'waist_predict'
      currentAction = Actions.sizePredict.fetchWaistPredict
    } else if (pathname === 'hip_size_inches') {
      this.sizePredictType = 'hips_predict'
      currentAction = Actions.sizePredict.fetchHipsPredict
    } else return null
    const { dispatch, style } = this.props
    const { height_inches, weight } = style
    const styleInput = {
      height_inches,
      weight
    }
    dispatch(currentAction(styleInput, this.handleFinishedFetchPredict))
  }

  checkPathname = () => {
    const { pathname } = this.props.location
    const type = pathname.split('select_size/')[1]
    return type
  }

  handleFinishedFetchPredict = (dispatch, response) => {
    const { available, max_value, min_value } = response.data[
      this.sizePredictType
    ]
    if (available) {
      this.setState({
        maxValue: max_value,
        minValue: min_value,
        hasSizePredict: true
      })
    }
  }

  handleValue = value => {
    this.scrollNum++
    const { hasSizePredict, maxValue, minValue } = this.state
    if (hasSizePredict && (value > maxValue || value < minValue)) {
      this.setState({ value, showSizePredict: true })
    } else {
      this.setState({ value })
    }
  }

  handleSaveSize = () => {
    this.props.dispatch(
      Actions.customerStyleInfo.updateUserDataAction({
        data: {
          style: { [this.size_option.type]: this.state.value }
        },
        success: this.handleUpdateSuccess
      })
    )
  }

  handleUpdateSuccess = (dispatch, res) => {
    const { incentive_granted } = res.data.UpdateStyle
    if (incentive_granted) {
      this.props.router.replace('/complete_size_success')
    } else {
      this.props.router.goBack()
    }
  }

  getBottomDescription = () => {
    let string = ''
    const { maxValue, minValue } = this.state
    const { title } = this.size_option
    if (this.sizePredictType === 'bust_predict') {
      const { bra_size, cup_size } = this.props.style
      string = `根据内衣尺码${bra_size}${cup_size}推算，你的${title}很可能是${minValue}-${maxValue}cm`
    } else {
      string = `根据你的身材数据推算，你的${title}很可能是${minValue}-${maxValue}cm`
    }
    return string
  }

  render() {
    const { title, bg_img, measurement } = this.size_option
    const disabled = this.scrollNum <= 1
    const { style, params } = this.props
    const { bra_size, cup_size } = style
    const { showSizePredict, value } = this.state
    let currentValue = value
    if (params.type === 'bust_size_number' && (!currentValue && bra_size)) {
      currentValue = bustSizeComputed(bra_size, cup_size)
    }
    currentValue = currentValue || this.size_option.defaultValue
    const bottomDescription = this.getBottomDescription()
    return (
      <div className="select-size">
        <PageHelmet title={title} link={this.props.location.pathname} />
        <i
          className="schematic-diagram"
          style={{ backgroundImage: `url(${bg_img})` }}
        />
        <div
          className="quotes"
          dangerouslySetInnerHTML={{ __html: measurement }}
        />
        <div className="select-value">
          <div className="value">{this.state.value}</div> &nbsp;cm
        </div>
        <SwiperSizeSelect
          maxValue={this.size_option.range[1]}
          minValue={this.size_option.range[0]}
          handleValue={this.handleValue}
          currentValue={currentValue}
        />
        {showSizePredict && (
          <div className="size-predict-view">{bottomDescription}</div>
        )}
        <StickyButtonContainer isSingle>
          <ActionButton disabled={disabled} onClick={this.handleSaveSize}>
            保存
          </ActionButton>
        </StickyButtonContainer>
      </div>
    )
  }
}
