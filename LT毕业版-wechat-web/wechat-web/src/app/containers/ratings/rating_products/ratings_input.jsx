import SingleSelectButtonGroup from 'src/app/components/buttons/single_select_button_group.jsx'
import SelectButtonGroup from 'src/app/components/buttons/select_button_group.jsx'
import CommentTextarea from './comment_textarea'
import StarRating from 'src/app/containers/ratings/star_rating'
import { useState, useEffect } from 'react'

function useResetRating(tote_product_id, resetData, initData = {}) {
  useEffect(() => {
    resetData(initData)
  }, [tote_product_id])
}

function getAnswerData(options) {
  let valueArr = [],
    displayArr = []
  if (!_.isEmpty(options)) {
    _.map(options, ({ display, value }) => {
      valueArr.push(value)
      displayArr.push(display)
    })
  }
  return { values: valueArr, displays: displayArr }
}

function SizeInput(props) {
  const {
    rating_loose_reason_display,
    rating,
    tote_product_id,
    followUps,
    handleChangeRatings
  } = props

  const [selectData, setSelectData] = useState(rating || {})

  useResetRating(tote_product_id, setSelectData, rating || {})

  useEffect(() => {
    setSelectData([])
  }, [rating.fit])

  const handleRating = (type, questionKey) => {
    let newSelectData = selectData
    const hasSelected = newSelectData[questionKey] === type[questionKey]
    if (hasSelected) {
      delete newSelectData[questionKey]
      if (newSelectData.bust !== 'loose' || newSelectData.waist !== 'loose') {
        delete newSelectData['loose_reason']
      }
      setSelectData(newSelectData)
      handleChangeRatings(newSelectData)
    } else {
      const newData = { ...newSelectData, ...type }
      if (newData.bust !== 'loose' || newData.waist !== 'loose') {
        delete newData['loose_reason']
      }
      setSelectData(newData)
      handleChangeRatings(type)
    }
  }

  return (
    <>
      {_.map(followUps, (followUp, index) => {
        const activeKey = followUp.key
        const { values, displays } = getAnswerData(followUp.options)
        return (
          <div key={index} className="wears-rating-box">
            <span className="rating-box-title">{followUp.display}</span>
            <SingleSelectButtonGroup
              questionKey={activeKey}
              answerValues={values}
              answerDisplays={displays}
              activeAnswer={selectData[activeKey]}
              onClick={handleRating}
            />
          </div>
        )
      })}
      {!_.isEmpty(selectData) &&
        selectData.bust === 'loose' &&
        selectData.waist === 'loose' && (
          <RatingLooseReason
            data={rating_loose_reason_display}
            selectData={selectData}
            handleRating={handleRating}
          />
        )}
    </>
  )
}

function RatingLooseReason(props) {
  const { data, selectData, handleRating } = props
  if (!data) return null
  const { allow_display, answers, question } = data
  if (!allow_display) return null

  const activeKey = 'loose_reason'

  const values = _.map(answers, ({ value }) => value)
  const displays = _.map(answers, ({ display }) => display)

  const onClick = (type, questionKey) => {
    if (selectData[activeKey] === type[questionKey]) {
      return
    }
    handleRating(type, questionKey)
  }

  return (
    <div className="wears-rating-box rating-loose-reason-box">
      <p>{question}</p>
      <SingleSelectButtonGroup
        questionKey={activeKey}
        answerValues={values}
        answerDisplays={displays}
        activeAnswer={selectData[activeKey]}
        onClick={onClick}
      />
    </div>
  )
}

function StyleAndOtherInput(props) {
  const [selectData, setSelectData] = useState([])

  useResetRating(props.tote_product_id, setSelectData, [])

  useEffect(() => {
    setSelectData([])
  }, [props.seletcType])

  const handleRating = (type, key) => {
    let newSelectData = selectData
    const value = type[key]
    if (_.includes(newSelectData, value)) {
      newSelectData = _.remove(newSelectData, v => v !== value)
    } else {
      newSelectData.push(value)
    }
    setSelectData(newSelectData)
    props.handleChangeRatings({ [key]: newSelectData })
  }

  return (
    <div className="wears-rating-box single-box">
      {_.map(props.followUps, (v, k) => {
        const { values, displays } = getAnswerData(v.options)
        return (
          <SelectButtonGroup
            key={k}
            questionKey={v.key}
            answerValues={values}
            answerDisplays={displays}
            activeAnswers={selectData}
            onClick={handleRating}
            isArray={true}
          />
        )
      })}
    </div>
  )
}

const title = {
  size: '不合身的地方',
  style_issues: '不喜欢的地方',
  quality_issues: '不满意的地方',
  liked_style: '喜欢的地方',
  liked_quality: '满意的地方'
}

const expensiveness = {
  group_human_name: '品质感',
  group_name: 'expensiveness',
  questions: []
}

const score = {
  style: 'style_score',
  quality: 'quality_score',
  expensiveness: 'expensiveness_score'
}

export default function RatingsInput(props) {
  const { handleChangeRatings, params, toteProduct } = props

  const [rating, setRating] = useState(toteProduct.rating || {})

  useResetRating(params.tote_product_id, setRating, toteProduct.rating || {})

  const handleComment = reason => handleChangeRatings({ comment: reason })

  const setRatingInfo = newRating => handleChangeRatings(newRating)

  const handleRating = type => {
    const newRating = { ...rating, ...type }
    setRating(newRating)
    setRatingInfo(newRating)
  }

  const handleStarClick = (num, key) => handleRating({ [score[key]]: num })

  const getFollowUps = (data, type) => {
    const questions = [...data.questions]
    if (data.group_name === 'size') {
      return _.remove(questions, v => v.key !== 'fit')
    } else {
      return _.filter(questions, v => v.key === type)
    }
  }

  const getSizeFollowUps = data => {
    return _.remove([...data.questions], v => v.key === 'fit')
  }

  const isShowSelectBox = (v, score) => {
    if (v.group_name === 'size') {
      return rating.fit === 'false'
    } else {
      return score <= 5 && score !== null
    }
  }

  const getSelectType = (data, score) => {
    if (data.group_name === 'size') {
      return 'size'
    } else if (data.group_name === 'quality') {
      return score <= 3 ? 'quality_issues' : 'liked_quality'
    } else if (data.group_name === 'style') {
      return score <= 3 ? 'style_issues' : 'liked_style'
    } else {
      return null
    }
  }

  const {
    ratingProduct,
    rating_question_sets,
    rating_loose_reason_display
  } = props
  return (
    <div id="tote-ratings" className="rating-appoint-select">
      <div className="product-ratings-info-container">
        <div className="rating-select">
          {_.map([...rating_question_sets, expensiveness], (v, k) => {
            if (!v) return null
            const selectScore = rating[score[v.group_name]]
            const seletcType = getSelectType(v, selectScore)
            const followUps = getFollowUps(v, seletcType)
            const sizeFollowUps = getSizeFollowUps(v)[0]
            return (
              <div key={k} className="margin-bottom">
                <div className="wears-rating-box">
                  <span className="rating-box-title">{v.group_human_name}</span>
                  {v.group_name === 'size' ? (
                    <SingleSelectButtonGroup
                      questionKey={sizeFollowUps.key}
                      answerValues={_.map(
                        sizeFollowUps.options,
                        ({ value }) => value
                      )}
                      answerDisplays={_.map(
                        sizeFollowUps.options,
                        ({ display }) => display
                      )}
                      activeAnswer={rating[sizeFollowUps.key]}
                      onClick={handleRating}
                    />
                  ) : (
                    <StarRating
                      toteRatingNum={selectScore}
                      changeStar={handleStarClick}
                      activeKey={v.group_name}
                    />
                  )}
                </div>
                <div
                  className={
                    isShowSelectBox(v, selectScore) && !_.isEmpty(followUps)
                      ? 'bad-question-select-box'
                      : 'hidden'
                  }
                >
                  <p className="bad-question-title">{title[seletcType]}</p>
                  {v.group_name !== 'size' ? (
                    <StyleAndOtherInput
                      rating={rating}
                      seletcType={seletcType}
                      followUps={followUps}
                      handleChangeRatings={handleChangeRatings}
                      tote_product_id={params.tote_product_id}
                    />
                  ) : (
                    <SizeInput
                      rating={rating}
                      followUps={followUps}
                      questionKey={v.rating_key}
                      handleChangeRatings={handleChangeRatings}
                      ratingProduct={ratingProduct || toteProduct}
                      tote_product_id={params.tote_product_id}
                      rating_loose_reason_display={rating_loose_reason_display}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <CommentTextarea
          {...props}
          placeholder="其他评价请留言"
          defaultValue={rating ? rating.comment : null}
          handleComment={handleComment}
          maxLength={300}
        />
      </div>
    </div>
  )
}
