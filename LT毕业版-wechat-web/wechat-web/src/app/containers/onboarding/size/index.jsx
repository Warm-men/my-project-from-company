import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions'
import ClothingSizes from './components/clothing_sizes'
import ActionButtons from 'src/app/containers/onboarding/utils_component/new_bottom_buttons'

import Header from 'src/app/containers/onboarding/utils_component/data_title'
import { calculateSize } from 'src/app/lib/calculate_size'
import PageHelmet from 'src/app/lib/pagehelmet'
import Hint from 'src/app/components/hint'
import { FULL_DRESS_SIZE, FULL_PANT_SIZE } from '../size'

class SizeContainer extends React.Component {
  constructor(props) {
    super(props)
    const { top_size, pant_size, dress_size, skirt_size } = props.customer.style

    const { weight, height_inches } = props.customer.style
    const defaultCalulate = calculateSize(height_inches, weight)

    const data = {
      top_size: top_size || defaultCalulate,
      pant_size: pant_size || FULL_PANT_SIZE[defaultCalulate],
      dress_size: dress_size || FULL_DRESS_SIZE[defaultCalulate],
      skirt_size: skirt_size || FULL_DRESS_SIZE[defaultCalulate]
    }

    this.state = { data, showHint: false, hasCheckHint: false, isSubmit: false }
  }

  updateCurrentSize = (info, activekey) => {
    if (this.state.data[activekey] !== info) {
      const data = { ...this.state.data }
      data[activekey] = info

      this.setState({ data, hasCheckHint: true })
    }
  }

  onSubmit = () => {
    const { hasCheckHint, isSubmit } = this.state
    if (isSubmit) return

    if (hasCheckHint) {
      this.handleHint()
    } else {
      this.setState({ showHint: true })
    }
  }

  handleHint = () => {
    this.setState({ isSubmit: true })

    const { dispatch } = this.props
    const style = { ...this.state.data, rescheduled_product_sizer: true }
    dispatch(
      Actions.customerStyleInfo.updateUserDataAction({
        data: { style },
        success: this.queueProductSize
      })
    )
  }

  queueProductSize = (dispatch, response) => {
    this.hideHint()
    const { onboarding } = this.props
    const { style } = response.data.UpdateStyle

    const routeName = onboarding.routerList[7]
    browserHistory.push(`/get-started/${routeName}`)

    if (style && style.top_size && style.dress_size) {
      dispatch(
        Actions.activeQueueProduct.activeQueueProduct({
          success: () => {}
        })
      )
    }
  }

  hideHint = () => this.setState({ showHint: false })

  render() {
    const { location } = this.props
    const { data, showHint, isSubmit } = this.state
    return (
      <div className="container-box">
        <PageHelmet title={'个人风格档案'} link={location.pathname} />
        <Header status={2} />
        <p className="onboarding-size-title ">请核对你的常穿尺码</p>
        <ClothingSizes
          isHiddenJean
          data={data}
          changeUserInfo={this.updateCurrentSize}
        />
        {showHint && (
          <Hint
            content="常穿尺码都正确吗？"
            leftBtnText="我再看看"
            rightBtnText="是的"
            isCenter={true}
            leftButton={this.hideHint}
            rightButton={this.handleHint}
            setAllButtonsRed={true}
            setVerticalMiddle={true}
          />
        )}
        <ActionButtons isSubmit={isSubmit} onFinished={this.onSubmit} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    onboarding: state.onboarding || {},
    customer: state.customer
  }
}

export default connect(mapStateToProps)(SizeContainer)
