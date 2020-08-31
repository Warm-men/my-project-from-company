import React from 'react'
import PropTypes from 'prop-types'
import PreventScroll from '../HOC/PreventScroll'
import './index.scss'

const HintComponent = React.memo(
  ({
    title,
    content,
    leftBtnText,
    rightBtnText,
    leftButton,
    rightButton,
    children,
    closeClick,
    textAlign,
    isCenter,
    setAllButtonsRed,
    setVerticalMiddle
  }) => (
    <div className="hint">
      <span className="shade" />
      <div className={`hint-alert ${setVerticalMiddle && 'fix-top'}`}>
        {closeClick && <span className="hint-close" onClick={closeClick} />}
        <div
          className={`hint-top-text ${isCenter ? 'center' : ''}`}
          style={{ textAlign }}
        >
          {title && <p>{title}</p>}
          {_.isEmpty(children) ? (
            <span
              className="top-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            children
          )}
        </div>
        <div className="buttons">
          {leftBtnText ? (
            <div
              className={`btn-same ${setAllButtonsRed ? 'red' : 'left-btn'}`}
              onClick={leftButton}
            >
              {leftBtnText}
            </div>
          ) : null}
          <div className="btn-same right-btn" onClick={rightButton}>
            {rightBtnText}
          </div>
        </div>
      </div>
    </div>
  )
)

HintComponent.propTypes = {
  leftButton: PropTypes.func.isRequired,
  rightButton: PropTypes.func.isRequired,
  title: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  leftBtnText: PropTypes.string.isRequired,
  rightBtnText: PropTypes.string.isRequired
}

const Hint = PreventScroll(HintComponent)

export default Hint
