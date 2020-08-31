import React from 'react'
import PropTypes from 'prop-types'
import './index.scss'

const SizeWrongWarn = ({
  text,
  redText,
  className,
  linkToSizeList,
  closeWarnTip
}) => {
  return [
    <div className="mask" onClick={closeWarnTip} onTouchMove={closeWarnTip} />,
    <div className={`size-wrong-warn ${className}`}>
      <i className="icon-delete" onClick={closeWarnTip} />
      {text}
      <span className="fix-size-wrong" onClick={linkToSizeList}>
        {redText}&nbsp;
        <i className="icon-red" />
      </span>
    </div>
  ]
}

SizeWrongWarn.propTypes = {
  text: PropTypes.string,
  redText: PropTypes.string,
  className: PropTypes.string,
  linkToSizeList: PropTypes.func,
  closeWarnTip: PropTypes.func
}

export default SizeWrongWarn
