import React from 'react'
import './index.scss'

export default function SubmitSuccess({ text, isSuccess = true }) {
  return (
    <div className="submit-success">
      <img
        src={require(`../images/${
          isSuccess ? 'submit_rating_success' : 'fail'
        }.svg`)}
        alt=""
      />
      {text || '提交成功'}
    </div>
  )
}
