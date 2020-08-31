import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import PageHelmet from 'src/app/lib/pagehelmet'
import './index.scss'

const getState = state => {
  return {
    customer: state.state,
    platform: state.app.platform
  }
}
@connect(getState)
export default class OpenFreeServiceSuccessful extends Component {
  constructor(props) {
    super(props)
    this.state = { price: null }
  }

  goBack = () => {
    if (this.props.location.state === 'new_totes')
      browserHistory.replace('/new_totes')
    else browserHistory.replace('/account')
  }

  openHelp = () => {
    browserHistory.push('/free_service_help')
  }

  render() {
    return (
      <div className="success-container">
        <PageHelmet title="自在选" link="/open_free_service_successful" />
        <img
          className="image-icon"
          alt=""
          src={require('../../../../assets/images/free_service/sucsess.png')}
        />
        <span className="text-intro">已开通自在选</span>
        <div className="help-container" onClick={this.openHelp}>
          <span className="text-help">使用帮助</span>
          <img
            className="image-help"
            alt=""
            src={require('../../../../assets/images/arrow_gray.png')}
          />
        </div>
        <div className="goback-container" onClick={this.goBack}>
          <span className="goback">返回</span>
        </div>
      </div>
    )
  }
}
