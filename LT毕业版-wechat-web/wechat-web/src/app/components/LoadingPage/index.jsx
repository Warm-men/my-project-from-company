import React from 'react'
import PropTypes from 'prop-types'
import './index.scss'

const LoadingPage = ({ text }) => (
  <div className="loading-page">
    <div className="loading" />
    <p className="loading-p">{text}</p>
  </div>
)

LoadingPage.propTypes = {
  text: PropTypes.string
}

LoadingPage.defaultProps = {
  text: '加载中...'
}

export default LoadingPage
