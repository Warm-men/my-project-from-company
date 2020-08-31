import leftArrow from 'src/assets/images/mobile/left_arrow.png'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import './index.scss'

export default function StyleProfileSaveButton(props) {
  const [status, setStatus] = useState('notSaved')

  useEffect(() => {
    setStatus(props.isSubmitting ? 'saving' : 'notSaved')
  }, [props.isSubmitting])

  const saveStyleProfile = () => {
    if (status !== 'saving') {
      setStatus('saving')
      props.saveStyleProfile(props.isFilterQuiz)
    }
  }

  const { isBack, isHeaderFixed } = props
  const isNotSaved = status === 'notSaved'
  return isBack ? (
    <div className={`back-button ${isHeaderFixed ? ' header-fixed' : ''}`}>
      <img
        src={leftArrow}
        className={`back-button-caret ${!isNotSaved ? ' hidden' : ''}`}
        onClick={saveStyleProfile}
        alt="...img"
      />
      <div className={`saving ${isNotSaved ? ' hidden' : ''}`}>...</div>
    </div>
  ) : (
    <div className="save-button-wrapper">
      <button className="save-button-wrapper" onClick={saveStyleProfile}>
        <div>{isNotSaved ? '保存' : '保存中...'}</div>
      </button>
    </div>
  )
}

StyleProfileSaveButton.propTypes = {
  saveStyleProfile: PropTypes.func.isRequired,
  isBack: PropTypes.bool,
  isFilterQuiz: PropTypes.bool,
  isHeaderFixed: PropTypes.bool,
  isSubmitting: PropTypes.bool
}
