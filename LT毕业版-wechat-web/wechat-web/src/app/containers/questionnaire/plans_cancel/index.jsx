import React from 'react'
import { browserHistory } from 'react-router'
import PropTypes from 'prop-types'
import WithHandleTouch from 'src/app/components/HOC/with_handletouch/index.jsx'
import './index.scss'
import {
  APPStatisticManager,
  ShenceStatisService
} from '../../../lib/statistics/app'

class Questionnaire extends React.Component {
  handleClick = data => () => {
    this.props.handleCancel()
    const link = data.web_route_name

    APPStatisticManager.sensor(ShenceStatisService.id).incrementProfile(
      data.sensors_id
    )
    window.adhoc('track', 'payquiz_complete', 1)
    if (_.isEmpty(link)) {
      return null
    } else if (_.includes(link, 'https')) {
      window.location.href = link
    } else if (_.includes(link, 'handlePayment')) {
      this.props.activePayment()
    } else {
      browserHistory.push(link)
    }
  }

  handleCancel = () => {
    const { queryData, handleCancel } = this.props
    APPStatisticManager.sensor(ShenceStatisService.id).incrementProfile(
      queryData.sensors_close_id
    )
    handleCancel()
  }

  render() {
    const { queryData, title } = this.props
    if (_.isEmpty(queryData)) {
      return null
    }
    return (
      <div className="questionnaire-box">
        <span className="shade" />
        <div className="questionnaire-container">
          <div className="questionnaire-container-box">
            <div className="questionnaire-close" onClick={this.handleCancel}>
              <span className="questionnaire-close-icon" />
            </div>
            <div className="title-wrapper-view">
              <img
                className="questionnaire-backgroundImage"
                src={queryData.popBackgroundImage}
                alt=""
              />
              <div className="questionnaire-title">{title}</div>
              {queryData.description && (
                <div className="questionnaire-title-sub">
                  {queryData.description}
                </div>
              )}
            </div>
            {_.map(queryData.content, (v, k) => {
              return (
                <div
                  onClick={this.handleClick(v)}
                  className="question-select"
                  style={{
                    display: !_.isEmpty(v.icon_url) ? 'flex' : 'block'
                  }}
                  key={k}
                >
                  <div>
                    {!_.isEmpty(v.icon_url) && (
                      <img className="select-icon" alt="" src={v.icon_url} />
                    )}
                    {v.title || v.sub_title}
                  </div>
                  {!_.isEmpty(v.icon_url) && (
                    <img
                      className="select-next"
                      alt=""
                      src={require('src/assets/images/account/next.png')}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

Questionnaire.propTypes = {
  queryData: PropTypes.object.isRequired,
  closeQuestionAlert: PropTypes.func.isRequired,
  activePayment: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

Questionnaire.defaultProps = {
  queryData: null,
  closeQuestionAlert: () => {},
  activePayment: () => {},
  title: ''
}

export default WithHandleTouch(Questionnaire)
