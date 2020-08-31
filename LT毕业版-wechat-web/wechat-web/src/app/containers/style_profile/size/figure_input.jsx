import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { useState, useEffect, useMemo } from 'react'
import Actions from 'src/app/actions/actions.js'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import ActionButton from 'src/app/components/shared/action_button/index'
import PageHelmet from 'src/app/lib/pagehelmet'
import * as storage from 'src/app/lib/storage.js'
import SubmitSuccess from 'src/app/containers/ratings/submit_success'
import { INPUT_LIST } from './utils'
import calculateSize from 'src/app/lib/calculate_size'
import { FULL_DRESS_SIZE } from 'src/app/containers/onboarding/size.js'
import { UseLoading } from 'src/app/containers/plans/abtest'
import delay from 'src/app/lib/delay.js'
import DataTitle from 'src/app/containers/onboarding/utils_component/data_title'
import 'src/app/containers/measure_detail/index.scss'
import 'src/assets/stylesheets/mobile/style_profile.scss'
import './index.scss'
import Hint from 'src/app/components/hint'
import FigureInputItem from './figure_input_item'

const mapStateToProps = state => {
  const { customer } = state
  return {
    customer_id: customer.id,
    customerStyleInfo: customer.style,
    customer
  }
}

export default connect(mapStateToProps)(withRouter(FigureDetailInput))
function FigureDetailInput(props) {
  const [isSubmit, setIsSubmit] = useState(false)
  const [isShowModal, setIsShowModal] = useState(false)
  const [isLoadingHint, setIsLoadingHint] = useState(false)
  const [isReceivedRule, setIsReceivedRule] = useState(false)
  const [showTips, setShowTips] = useState(false)

  const { dispatch } = props
  const {
    query: { pre_page, type },
    state
  } = props.location

  const {
    height_inches,
    weight,
    shape,
    shoulder_size,
    bust_size_number,
    waist_size,
    hip_size_inches,
    inseam
  } = props.customerStyleInfo

  const isGuide =
    (state && state.style_wrong) ||
    pre_page === 'rating' ||
    pre_page === 'confirm_size'
  const isSizeChart = pre_page === 'size_chart'
  const isProductsSizeFilter = pre_page === 'products_size_filter'
  const isProductDetail = pre_page === 'product_detail'
  const isConfirmSize = pre_page === 'totes'
  const isNonMemberSize = pre_page === 'nonMember_size'

  useEffect(() => {
    type && storage.set('StyleOutside', true)
    if (
      !props.customer.first_delivered_tote &&
      !getActiveButton() &&
      !storage.get('displayedTips')
    ) {
      setShowTips(true)
    }
    setIsReceivedRule(storage.get('isReceivedRule') === 'true')
  }, [])

  const setReceivedRule = isReceivedRule => {
    setIsReceivedRule(isReceivedRule)
    setShowTips(false)
  }

  const handleSaveInfo = () => {
    storage.set('displayedTips', true)
    setIsSubmit(true)
    handleSubmit()
  }

  const handleSubmit = () => {
    const { bra_size, cup_size, dress_size, top_size } = props.customerStyleInfo
    // NOTE: height_inches weight必要项没有时
    if (!(height_inches && weight)) {
      dispatch(
        Actions.app.showGlobalAlert({
          content: '填写必填项才能推荐尺码哟',
          btnText: '好的',
          handleClick: () => dispatch(Actions.app.resetGlobalAlert())
        })
      )
      setIsSubmit(false)
      return null
    }

    // NOTE:用户的KG体重转为斤
    const userWeight = weight * 2,
      trackData = {
        height_inches: height_inches,
        weight: weight,
        bra_size: bra_size,
        cup_size: cup_size
      },
      userCalSize = calculateSize(height_inches, userWeight, trackData),
      dressSize = dress_size || FULL_DRESS_SIZE[userCalSize],
      topSize = top_size || userCalSize

    const isGotoSizeInput = !(
      isGuide ||
      isSizeChart ||
      isProductDetail ||
      isConfirmSize ||
      isProductsSizeFilter ||
      isNonMemberSize
    )
    if (isGotoSizeInput) {
      props.router.push('/style_profile/size_input')
      return null
    }

    dispatch(
      Actions.customerStyleInfo.updateUserDataAction({
        data: {
          style: {
            dress_size: dressSize,
            top_size: topSize,
            rescheduled_product_sizer: true
          }
        },
        success: handleActiveProductSuccess
      })
    )
  }

  const handleActiveProductSuccess = async (dispatch, res) => {
    const { incentive_granted } = res.data.UpdateStyle
    if (incentive_granted) {
      props.router.replace('/complete_size_success')
      return null
    }
    if (isGuide) {
      setIsShowModal(true)
      await delay(250)
      props.router.goBack()
    } else if (isSizeChart || isProductDetail || isConfirmSize) {
      props.router.goBack()
    } else if (isProductsSizeFilter) {
      setIsLoadingHint(true)
      dispatch(
        Actions.products.productSizeFilter({ products_size_filter: true })
      )
      await delay(3000)
      props.router.goBack()
    } else if (isNonMemberSize) {
      props.router.go(-2)
    } else {
      props.router.push('/style_profile/size_input')
    }
  }

  const ucfirst = string => {
    if (_.isEmpty(string)) return ''
    let str = string.toLowerCase()
    str = str.replace(/\b\w+\b/g, word => {
      return word.substring(0, 1).toUpperCase() + word.substring(1)
    })
    return str
  }

  const getUserSizeImg = useMemo(() => {
    const { shape } = props.customerStyleInfo
    const imgSrc = shape ? shape : 'Hourglass'
    return require(`src/app/containers/onboarding/measurefile/images/${ucfirst(
      imgSrc
    )}.svg`)
  }, [props.customerStyleInfo.shape])

  const getButtonText = () => {
    let buttonText = '下一步'

    if (state) {
      if (state.style_wrong === 'errors_style_wrong') {
        buttonText = '我已确认完成'
      } else {
        buttonText = '保存'
      }
    }

    if (isNonMemberSize) buttonText = '立即推荐'

    if (isSizeChart || pre_page === 'rating' || isProductDetail)
      buttonText = '保存'

    if (pre_page === 'confirm_size') buttonText = '我已确认完成'

    if (isProductsSizeFilter) buttonText = '开启智能选码'

    if (isConfirmSize) buttonText = '确认无误'

    if (isSubmit) buttonText = '处理中'

    return buttonText
  }

  const getActiveButton = () => {
    return !!(
      height_inches &&
      weight &&
      shape &&
      shoulder_size &&
      bust_size_number &&
      waist_size &&
      hip_size_inches &&
      inseam
    )
  }

  return (
    <div
      className={`quiz-wrapper profile-style ${
        isConfirmSize ? 'container-box' : ''
      }`}
    >
      <PageHelmet
        title={isGuide ? '完善尺码' : '尺码'}
        link="/style_profile/figure_input"
      />
      {isConfirmSize && (
        <DataTitle
          title="确认个人尺码"
          text="建议测量并核对个人尺码信息，如果尺码有误请尽快更新，确认无误后可点击底部按钮告诉我们哦"
        />
      )}
      {isLoadingHint && (
        <UseLoading>
          <span className="use-cash">
            正在比对尺码
            <br />
            预计3分钟后生效
          </span>
        </UseLoading>
      )}
      {!isConfirmSize && !isNonMemberSize && (
        <p className="tips-text">
          我们始终坚持手工测量每件衣服，只需提供尺码信息，托特衣箱就能为你推荐最合身的尺码
        </p>
      )}
      {isNonMemberSize && (
        <h5 className="figure-detail-tips">
          <span className="tips-icon">*</span>Tips：身高、体重、胸围为必填项
        </h5>
      )}
      <div className="figure-detail-container">
        <div className="figure-detail-img-box">
          <img className="img-box" src={getUserSizeImg} alt="" />
        </div>
        <div className="figure-detail-ipuut">
          {_.map(INPUT_LIST, (v, k) => {
            return (
              <FigureInputItem
                key={k}
                data={v}
                dispatch={dispatch}
                style={props.customerStyleInfo}
                isReceivedRule={isReceivedRule}
                router={props.router}
              />
            )
          })}
        </div>
      </div>
      {isShowModal && <SubmitSuccess text="保存成功" />}
      {showTips && (
        <Hint
          title="请使用卷尺测量填写"
          textAlign="center"
          leftBtnText="我没卷尺"
          rightBtnText="我有卷尺"
          leftButton={() => setReceivedRule(false)}
          setAllButtonsRed
          rightButton={() => setReceivedRule(true)}
        >
          <div className="hint-content">
            只有提供准确的个人身材数据，智能尺码推荐才会更精准，选码无忧更省心
          </div>
          <div className="hint-tips">
            *首个衣箱会赠送卷尺，也可签收后再来测量
          </div>
        </Hint>
      )}
      {!isReceivedRule && (
        <div className="rule-tips">
          *首个衣箱会赠送卷尺，请使用卷尺测量个人身材数据
        </div>
      )}
      <StickyButtonContainer>
        <ActionButton
          className={isSubmit ? 'submiting' : ''}
          size="stretch"
          onClick={handleSaveInfo}
          disabled={isProductsSizeFilter ? !getActiveButton() : false}
        >
          {getButtonText()}
        </ActionButton>
      </StickyButtonContainer>
    </div>
  )
}
