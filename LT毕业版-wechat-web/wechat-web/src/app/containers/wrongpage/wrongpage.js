import React, { useEffect } from 'react'
import isDevEnv from 'src/app/lib/isDevEnv.js'
import './index.scss'

export default function WrongPage(props) {
  useEffect(() => {
    const time = !isDevEnv ? 1000 : 10000
    setTimeout(() => {
      if (props.isMiniApp) {
        wx.miniProgram.navigateBack({
          delta: 1
        })
      }
      !isDevEnv && window.location.replace(window.location.origin)
    }, time)
  }, [])
  return (
    <div className="wrong-page">
      <div className="wrong-img" onClick={props.errorHandle} />{' '}
      <div className="wrong-text">
        {' '}
        {!props.errorInfo ? (
          `未知错误！`
        ) : (
          <div>
            <p> {props.errorInfo.name} </p> <p> {props.errorInfo.message} </p>{' '}
          </div>
        )}{' '}
      </div>{' '}
    </div>
  )
}
