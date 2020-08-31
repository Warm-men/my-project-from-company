import React, { Component } from 'react'
import './index.scss'

export default class TipsModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowTips: false
    }
  }

  btnList = () => {
    const {
      singleBtn,
      singleBtnClick,
      leftBtn,
      rightBtn,
      leftBtnClick,
      rightBtnClick
    } = this.props
    if (singleBtn) {
      return (
        <span className="tips-btn" onClick={singleBtnClick}>
          {singleBtn}
        </span>
      )
    } else {
      return [
        <span
          key="left"
          className="tips-btn marginRight"
          onClick={leftBtnClick}
        >
          {leftBtn}
        </span>,
        <span key="right" className="tips-btn" onClick={rightBtnClick}>
          {rightBtn}
        </span>
      ]
    }
  }

  render() {
    const { title } = this.props
    return (
      <div className="appointment-tips-modal">
        <div className="appointment-tips-container">
          <p className="tips-title">{title}</p>
          <div className="tips-btn-box">{this.btnList()}</div>
        </div>
      </div>
    )
  }
}

TipsModal.defaultProps = {
  title: ``,
  singleBtn: null,
  singleBtnClick: () => {},
  leftBtn: null,
  rightBtn: null,
  leftBtnClick: () => {},
  rightBtnClick: () => {}
}
