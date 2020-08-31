import { connect } from 'react-redux'
import { useState } from 'react'
import Actions from 'src/app/actions/actions'
import PageHelmet from 'src/app/lib/pagehelmet'

import { calJeanSize, calculateSize } from 'src/app/lib/calculate_size'
import {
  FULL_DRESS_SIZE,
  FULL_PANT_SIZE
} from 'src/app/containers/onboarding/size.js'

import Hint from 'src/app/components/hint'
import ClothingSizes from 'src/app/containers/onboarding/size/components/clothing_sizes'
import ActionButtons from 'src/app/containers/onboarding/utils_component/action_buttons'

function mapStateToProps(state) {
  return {
    onboarding: state.onboarding || {},
    customer: state.customer
  }
}

export default connect(mapStateToProps)(SizeContainer)

function SizeContainer(props) {
  const { customer, location, submitSuccess, dispatch } = props
  const {
    top_size,
    pant_size,
    dress_size,
    skirt_size,
    jean_size,
    waist_size,
    weight,
    height_inches,
    jean_size_unknow
  } = customer.style
  const defaultCalulate = calculateSize(height_inches, weight)
  const [submitData, setSubmitData] = useState({
    top_size: top_size || defaultCalulate,
    pant_size: pant_size || FULL_PANT_SIZE[defaultCalulate],
    dress_size: dress_size || FULL_DRESS_SIZE[defaultCalulate],
    skirt_size: skirt_size || FULL_DRESS_SIZE[defaultCalulate],
    jean_size: jean_size
      ? jean_size
      : jean_size_unknow
      ? null
      : calJeanSize(height_inches, weight, waist_size)
  })
  const [isSubmit, setIsSubmit] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [shouldShowHint, setShouldShowHint] = useState(true)

  const changeUserInfo = (info, activekey) => {
    if (submitData[activekey] !== info) {
      const newSubmitData = { ...submitData }
      newSubmitData[activekey] = info
      setShouldShowHint(false)
      setSubmitData(newSubmitData)
    }
  }

  const onSubmit = () => {
    if (shouldShowHint) {
      setShowHint(true)
    } else {
      handleHintNext()
    }
  }

  const queueProductSize = (dispatch, res) => {
    if (submitData && submitData.top_size && submitData.dress_size) {
      dispatch(
        Actions.activeQueueProduct.activeQueueProduct({
          success: () => {}
        })
      )
    }
    hideHint()
    const { incentive_granted } = res.data.UpdateStyle
    submitSuccess && submitSuccess(incentive_granted)
  }

  const isValidSizeInfo = () => {
    const {
      top_size,
      pant_size,
      dress_size,
      skirt_size,
      jean_size
    } = submitData
    return top_size && pant_size && dress_size && skirt_size && jean_size
  }

  const handleHintNext = () => {
    setIsSubmit(true)
    let newSubmitData = { ...submitData, rescheduled_product_sizer: true }
    dispatch(
      Actions.customerStyleInfo.updateUserDataAction({
        data: { style: newSubmitData },
        success: queueProductSize
      })
    )
  }

  const hideHint = () => setShowHint(false)

  return (
    <div className="container-box">
      <PageHelmet title={'常穿尺码'} link={location.pathname} />
      <ClothingSizes data={submitData} changeUserInfo={changeUserInfo} />
      <ActionButtons
        isSubmiting={isSubmit}
        rightText={'确认无误'}
        rightDisabled={!isValidSizeInfo()}
        nextStep={onSubmit}
      />
      {showHint && (
        <Hint
          content="常穿尺码都正确吗？"
          leftBtnText="我再看看"
          rightBtnText="是的"
          isCenter={true}
          leftButton={hideHint}
          rightButton={handleHintNext}
          setAllButtonsRed={true}
          setVerticalMiddle={true}
        />
      )}
    </div>
  )
}
