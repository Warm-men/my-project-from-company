import { useState, useEffect } from 'react'
import './comment_textarea.scss'

export default function CommentTextarea({
  defaultValue,
  maxLength = 150,
  params = {},
  handleComment = () => {},
  placeholder,
  hideTips
}) {
  const [reason, setReason] = useState(defaultValue || '')

  useEffect(() => {
    if (!_.isEmpty(params)) {
      setReason('')
    }
  }, [params.tote_product_id])

  const handleInput = e => {
    const reason = e.currentTarget.value
    if (reason.length <= maxLength) {
      setReason(reason)
      handleComment(reason)
    }
  }

  return (
    <div className="textarea-box">
      <div className="textarea-container">
        <textarea
          className="textarea"
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={handleInput}
          value={reason}
        />
      </div>
      {!hideTips && (
        <div className="text-length-tips">
          {reason.length}/{maxLength}
        </div>
      )}
    </div>
  )
}
