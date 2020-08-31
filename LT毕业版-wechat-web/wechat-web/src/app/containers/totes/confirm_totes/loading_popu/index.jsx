import React from 'react'
import './index.scss'

export const Loading = ({ text, children, isShowCircleIcon = true }) => (
  <div className="loading-submiting-box">
    <div className={'loading-gift'}>
      {isShowCircleIcon && <div className="loading" />}
      <span className="use-cash">{text}</span>
      {children}
    </div>
  </div>
)

export default Loading
