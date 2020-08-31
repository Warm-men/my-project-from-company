import { browserHistory } from 'react-router'
import ActionButton from 'src/app/components/shared/action_button'
import PageHelmet from 'src/app/lib/pagehelmet'
import { format } from 'date-fns'
import './index.scss'

function ExchangeResultError({ location, handleClick }) {
  return (
    <>
      <div className="result-tips">{location.query.errors}</div>
      <ActionButton className="result-btn" onClick={handleClick} size="small">
        返回
      </ActionButton>
    </>
  )
}

function ExchangeResultSuccess({ location, handleClick }) {
  const { exchange_name, promoCodeName, promoCodeDate } = location.query
  const time = format(promoCodeDate, 'YYYY年MM月DD日')
  return (
    <>
      <div className="result-tips">
        {exchange_name ? (
          <p>{`兑换${exchange_name}成功`}</p>
        ) : (
          <>
            <p className="tips-text">{promoCodeName}已放入你的账户</p>
            <p>有效期至{time}</p>
          </>
        )}
      </div>
      <ActionButton className="result-btn" onClick={handleClick} size="small">
        {exchange_name ? '返回' : '立即使用'}
      </ActionButton>
    </>
  )
}

export default class ExchangeResults extends React.Component {
  didSelectedButton = () => {
    const {
      location: { query }
    } = this.props
    const isSuccessed = query.result === 'true'
    if (isSuccessed && !query.exchange_name) {
      browserHistory.replace('/plans')
    } else {
      if (query.exchange_name) {
        browserHistory.go(-2)
      } else {
        browserHistory.goBack()
      }
    }
  }

  render() {
    const { location } = this.props
    const isSuccessed = location.query.result === 'true'
    return (
      <div className="exchange-results">
        <PageHelmet title="兑换结果" link="/exchange_result" />
        <div className={`result-icon ${isSuccessed ? '' : 'fail'}`} />
        {!location.query.exchange_name && (
          <span className="results-desc">
            {isSuccessed ? '优惠券兑换成功' : '优惠券兑换失败'}
          </span>
        )}
        {isSuccessed ? (
          <ExchangeResultSuccess
            handleClick={this.didSelectedButton}
            {...this.props}
          />
        ) : (
          <ExchangeResultError
            handleClick={this.didSelectedButton}
            {...this.props}
          />
        )}
      </div>
    )
  }
}
