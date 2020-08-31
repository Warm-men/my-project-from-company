import React from 'react'
import PropTypes from 'prop-types'
import './index.scss'

const UploadFile = ({ fileType, handleUpload, children }) => {
  const _handleUpload = () => {
    this.inputRef.click()
  }
  const _handleImageChange = event => {
    event.preventDefault()
    const file = event.target.files[0]
    handleUpload(file)
  }
  return (
    <div>
      <div className="share-input" onClick={_handleUpload} />
      <input
        style={{ display: 'none' }}
        type="file"
        accept={fileType}
        ref={input => (this.inputRef = input)}
        onChange={_handleImageChange}
      />
      {children}
    </div>
  )
}

UploadFile.propTypes = {
  fileType: PropTypes.string
}

UploadFile.defaultProps = {
  fileType: ''
}

export default UploadFile
