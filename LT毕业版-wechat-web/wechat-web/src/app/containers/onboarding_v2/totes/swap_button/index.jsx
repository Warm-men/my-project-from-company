import { browserHistory } from 'react-router'
import { pure, withHandlers, compose } from 'recompose'
import { useState, useEffect } from 'react'
import Actions from 'src/app/actions/actions'

import CountDown from 'src/app/components/count_down'

import './index.scss'

const ABTEST_TEXT = ['更换商品', '我要换衣', '更换商品 300款精选']

const enhance = compose(
  pure,
  withHandlers({
    returnTime: props => () => {
      const { tote: latest_rental_tote } = props
      let minutes = 0,
        seconds = 0
      if (!latest_rental_tote || !latest_rental_tote.stock_locked_at) {
        return { minutes, seconds }
      }
      let diffTime =
        new Date(latest_rental_tote.stock_locked_at).getTime() -
        new Date().getTime() +
        1800000

      if (diffTime < 0) {
        return { minutes, seconds }
      } else {
        minutes = parseInt((diffTime % (1000 * 60 * 60)) / (1000 * 60), 10)
        seconds = parseInt((diffTime % (1000 * 60)) / 1000, 10)
        if (minutes < 10) {
          minutes = `0${minutes}`
        }
        if (seconds < 10) {
          seconds = `0${seconds}`
        }
        return { minutes, seconds }
      }
    }
  })
)

const toPlans = () => {
  window.adhoc('track', 'onboarding_13', 1)
  browserHistory.push('/plans')
}

const SwapButton = enhance(props => {
  const { returnTime, tote } = props
  const tip = tote && tote.onboarding_tips

  const [swapButtonText, setSwapButtonText] = useState(null)

  useEffect(() => {
    window.adhoc('getFlags', flag => {
      const value = flag.get('D181212_WECHAT_NEW_ALL_ALL')
      setSwapButtonText(ABTEST_TEXT[value])
    })
  }, [])

  const swapToteProduct = async () => {
    window.adhoc('track', 'swap_button', 1)
    window.adhoc('track', 'onboarding_11', 1)

    const { dispatch } = props
    await dispatch(Actions.mycloset.setWishingClosetFilter('clothing'))
    browserHistory.push('/customize/collections')
  }

  return (
    <div className="onboarding-tote-swap-button">
      {swapButtonText ? (
        <div className="swap-button" onClick={swapToteProduct}>
          {swapButtonText}
        </div>
      ) : null}
      {tip ? <div className="onboarding-tip">{tip}</div> : null}
      <div className="lock-button" onClick={toPlans}>
        立即下单{' '}
        <CountDown
          text={'库存锁定'}
          minutes={returnTime().minutes}
          seconds={returnTime().seconds}
        />
      </div>
    </div>
  )
})

export default SwapButton
