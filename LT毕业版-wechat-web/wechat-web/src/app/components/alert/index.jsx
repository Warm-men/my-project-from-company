import React from 'react'
import PreventScroll from 'src/app/components/HOC/PreventScroll/index_hooks.jsx'
import './index.scss'

const Alert = React.memo(
  ({
    icon,
    title,
    content,
    textAlign,
    handleClick,
    btnText,
    children,
    alertPaddingFix
  }) => (
    <div className="alert-modal">
      <span className="shade" />
      <div className="hint-alert">
        <div className={`top-text ${alertPaddingFix ? alertPaddingFix : ''}`}>
          {icon && <img className="icon" src={icon} alt="" />}
          {title && <p className="title-p">{title}</p>}
          {_.isEmpty(children) ? (
            <span
              style={{ textAlign: textAlign ? textAlign : 'center' }}
              className="top-content"
            >
              {content}
            </span>
          ) : (
            children
          )}
        </div>
        <div className="btn-same alert-btn" onClick={handleClick}>
          {btnText}
        </div>
      </div>
    </div>
  )
)

export default PreventScroll(Alert)
