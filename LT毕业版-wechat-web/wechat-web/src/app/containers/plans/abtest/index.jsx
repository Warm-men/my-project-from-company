import React from 'react'
import PropTypes from 'prop-types'
import PreventScrollHOC from 'src/app/components/HOC/PreventScroll'
import DeviceType from 'src/app/lib/device_type'
import classnames from 'classnames'
import './index.scss'

const CoupleGift = PreventScrollHOC(({ handleUsePromoCode }) => {
  return (
    <div className="couple-gift">
      <div
        className={classnames('right-away-use', {
          iphoneX: DeviceType().isIphoneX
        })}
        onClick={handleUsePromoCode}
      />
    </div>
  )
})

CoupleGift.propTypes = {
  handleUsePromoCode: PropTypes.func.isRequired
}

export const UseLoading = PreventScrollHOC(({ text, children }) => (
  <div className="loading-submiting-box">
    <div className="loading-gift">
      <div className="loading" />
      <span className="use-cash">{text}</span>
      {children}
    </div>
  </div>
))

export default React.memo(CoupleGift)
