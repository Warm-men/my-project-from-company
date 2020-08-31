import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import Actions from 'src/app/actions/actions.js'
import './index.scss'

const queryFeedbackResult = (data, success) => {
  return {
    type: 'API:FEEDBACKRESULT:QUERY',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: `query WebFeedbackResult($tote_id: Int!, $resolve_tote_issue: Boolean) {
          feedback_result(tote_id: $tote_id, resolve_tote_issue: $resolve_tote_issue) {
            main_text
            quality_issue_text
          }
        }
      `,
      variables: { ...data }
    },
    success
  }
}

function ServiceRating({ location, dispatch }) {
  const [feedback_result, setFeedbackResult] = useState({})

  useEffect(() => {
    const { query } = location
    const formData = { tote_id: Number(query.tote_id) }
    if (!_.isEmpty(query.resolve_tote_issue)) {
      formData['resolve_tote_issue'] = query.resolve_tote_issue === 'true'
    }
    dispatch(
      queryFeedbackResult(formData, (dispatch, data) => {
        dispatch(Actions.ratings.resetRatingStore())
        setFeedbackResult(data.data.feedback_result)
        dispatch(Actions.totes.fetchLatestRentalAndPurchaseTote())
      })
    )
  }, [])

  if (_.isEmpty(feedback_result)) {
    return null
  }

  const gotoScheduleReturn = () => {
    dispatch(Actions.totes.resetToteProduct())
    browserHistory.replace('/totes')
  }

  return (
    <div className="service-rating-success-container">
      <PageHelmet title="商品投诉" link="/service_rating_success" />
      <div className="success-title-box">
        <img alt="" className="img" src={require('./images/img.png')} />
        <div className="success-title">
          <h5 className="title">提交成功</h5>
          <p className="text">{feedback_result.main_text}</p>
          <p className="text clear-margin">
            {feedback_result.quality_issue_text}
          </p>
        </div>
      </div>
      <div className="success-content-box">
        <div className="success-btn" onClick={gotoScheduleReturn}>
          返回衣箱
        </div>
      </div>
    </div>
  )
}

export default connect()(ServiceRating)
