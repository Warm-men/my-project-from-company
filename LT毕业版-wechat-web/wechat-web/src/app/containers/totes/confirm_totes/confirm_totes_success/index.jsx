import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import ActionButton from 'src/app/components/shared/action_button'
import Actions from 'src/app/actions/actions.js'
import StarRating from 'src/app/containers/ratings/star_rating'
import PageHelmet from 'src/app/lib/pagehelmet'
import RatingQuestion from './rating_question'
import ReferralConfirm from './referral_confirm'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import SubmitSuccess from 'src/app/containers/ratings/submit_success'
import 'src/assets/stylesheets/components/desktop/ratings/product_ratings.scss'
import 'src/assets/stylesheets/components/desktop/ratings/ratings.scss'
import './index.scss'

function mapStateToProps(state) {
  return { totes: state.totes }
}

export default connect(mapStateToProps)(ConfirmSuccess)

function ConfirmSuccess(props) {
  const { dispatch, location, totes } = props
  const { tote_swap_questionnaire, latest_rental_tote } = totes

  const [starNum, setStarNum] = useState(0)
  const [selectOptions, setSelectOptions] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isShowConfirm, setIsShowConfirm] = useState(false)
  const [toteSwapQuestionnaire, setToteSwapQuestionnaire] = useState({})
  const [reasonValue, setReasonValue] = useState(null)

  useEffect(() => {
    if (_.isEmpty(latest_rental_tote)) {
      dispatch(Actions.totes.fetchLatestRentalAndPurchaseTote())
    }
  }, [])

  useEffect(() => {
    if (!_.isEmpty(totes.tote_swap_questionnaire)) {
      setToteSwapQuestionnaire(totes.tote_swap_questionnaire)
    }
  }, [totes.tote_swap_questionnaire])

  const handleStarClick = rating => {
    const number = Number(rating)
    if (number > 3) {
      setSelectOptions([])
      setReasonValue('')
    }
    setStarNum(number)
  }

  const handleSubmit = () => {
    if (isLoading) return null

    const isEmpty = _.isEmpty(selectOptions) && _.isEmpty(reasonValue)
    if (starNum === 0 || (starNum <= 3 && isEmpty)) {
      const content =
        starNum === 0 ? `请选择选衣下单体验满意度` : `请选择选衣时遇到的问题`
      dispatch(Actions.tips.changeTips({ isShow: true, content }))
      return null
    }

    setIsLoading(true)
    const input = {
      rating_level: starNum,
      tote_id: Number(location.query.tote_id),
      options: selectOptions,
      user_custom: reasonValue || ''
    }
    dispatch(Actions.totes.submitSwapQuestion(input, handleSubmitSuccess))
  }

  const handleSubmitSuccess = () => {
    setShowModal(true)
    setIsLoading(false)
    dispatch(Actions.tips.changeTips({ isShow: false, content: `` }))
    setTimeout(() => setIsShowConfirm(true), 1000)
  }

  const changeQuestion = reason => {
    setSelectOptions([...reason])
  }

  const updateReasonValue = value => {
    setReasonValue(value)
  }

  if ((_.isEmpty(tote_swap_questionnaire) && !showModal) || isShowConfirm) {
    return <ReferralConfirm />
  }
  if (_.isEmpty(toteSwapQuestionnaire)) return <></>
  const {
    options,
    theme_question,
    improvement_question
  } = toteSwapQuestionnaire

  const isDisplayReasons = !!starNum && starNum <= 3
  return (
    <div className="confirm-success">
      <div className="confirm-totes-suc tote-ratings-modal" id="tote-ratings">
        <PageHelmet link="/confirm-totes-success" title=" " isNotPostMsg />
        {!!showModal && <SubmitSuccess text="感谢反馈" />}
        <div
          className="confirm-rating-box"
          style={{ paddingTop: isDisplayReasons ? 0 : 100 }}
        >
          <div className="rating-question fix-margin-bottom">
            {theme_question}
          </div>
          <StarRating
            className="rating-modal-star-container"
            toteRatingNum={starNum}
            changeStar={handleStarClick}
          />
          {isDisplayReasons ? (
            <>
              <div className="rating-question">{improvement_question}</div>
              <div className="tote-ratings-container ">
                <RatingQuestion
                  options={options}
                  swapQuestion={selectOptions}
                  changeQuestion={changeQuestion}
                  maxQuestionLimit={3}
                  updateReasonValue={updateReasonValue}
                />
              </div>
            </>
          ) : null}

          <StickyButtonContainer>
            <ActionButton
              size="stretch"
              onClick={handleSubmit}
              className="flex-button"
            >
              {isLoading ? '提交中' : '提交'}
            </ActionButton>
          </StickyButtonContainer>
        </div>
      </div>
    </div>
  )
}
