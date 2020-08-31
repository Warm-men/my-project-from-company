import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions'
import './index.scss'
import BG from './images/tote_nomember.png'

const SHOW_LIST = [
  '知名品牌随心换穿',
  '每箱多至6件衣服+4件配饰',
  '顺丰往返免运费'
]

const getState = state => ({
  app: state.app,
  customer: state.customer
})

export default connect(getState)(NonMembers)
function NonMembers({ customer, app, dispatch }) {
  const handleJoin = () => {
    const { jd_credit_score } = customer
    if (
      app.platform === 'jd' &&
      jd_credit_score &&
      Number(jd_credit_score.score) < 70
    ) {
      dispatch(
        Actions.app.showGlobalAlert({
          content: '你的小白信用低于70分，暂时还不能享受免押金权益',
          handleClick: () => dispatch(Actions.app.resetGlobalAlert()),
          btnText: '好的'
        })
      )
      return null
    }
    browserHistory.push('/plans?next_page=authorize')
  }

  return (
    <div className="non-members">
      <img src={BG} alt="...img" />
      <p className="non-members-title">欢迎加入这场时尚变革！</p>
      {_.map(SHOW_LIST, (item, key) => (
        <p className="non-members-text" key={key}>
          <span className="non-members-icon" />
          {item}
        </p>
      ))}
      <button onClick={handleJoin}>加入会员</button>
    </div>
  )
}
