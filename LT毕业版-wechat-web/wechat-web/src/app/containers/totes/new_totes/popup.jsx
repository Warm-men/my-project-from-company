import React from 'react'
import withHandleTouch from 'src/app/components/HOC/with_handletouch'
import './index.scss'

const Popup = React.memo(({ popup, next, close }) => (
  <div className="alert-modal">
    <span className="shade" />
    <div className="popup-wrapper">
      <img className="banner-bg-img" alt="" src={popup.url} />
      <div className="close" onClick={close}></div>
      <div className="bottom-view">
        <div className="next-button" onClick={next}>
          免费开通
        </div>
        <div className="diss-text" onClick={close}>
          以后再说
        </div>
      </div>
    </div>
  </div>
))

export default withHandleTouch(Popup)
